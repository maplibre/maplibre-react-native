import maplibreGlStyleSpec from "@maplibre/maplibre-gl-style-spec/src/reference/latest";
import ejs from "ejs";
import { execSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import prettier from "prettier";

import { DocJSONBuilder } from "./utils/DocJSONBuilder";
import { MarkdownBuilder } from "./utils/MarkdownBuilder";
import { camelCase } from "./utils/TemplateHelpers";
import * as TemplateHelpers from "./utils/TemplateHelpers";
import {
  getAndroidVersion,
  getIosVersion,
  isVersionGTE,
} from "./utils/getNativeVersion";

const TEMPLATES_PATH = path.join(__dirname, "templates");

const IOS_OUTPUT_PATH = path.join(__dirname, "..", "ios", "MLRN");
const ANDROID_OUTPUT_PATH = path.join(
  __dirname,
  "..",
  "android",
  "src",
  "main",
  "java",
  "org",
  "maplibre",
  "reactnative",
  "components",
  "styles",
);

const JS_OUTPUT_PATH = path.join(__dirname, "..", "src");

const TEMPLATE_MAPPINGS = [
  {
    input: path.join(TEMPLATES_PATH, "MLRNStyle.h.ejs"),
    output: path.join(IOS_OUTPUT_PATH, "MLRNStyle.h"),
  },
  {
    input: path.join(TEMPLATES_PATH, "MapLibreRNStyles.ts.ejs"),
    output: path.join(JS_OUTPUT_PATH, "types", "MapLibreRNStyles.ts"),
  },
  {
    input: path.join(TEMPLATES_PATH, "MLRNStyle.m.ejs"),
    output: path.join(IOS_OUTPUT_PATH, "MLRNStyle.m"),
  },
  {
    input: path.join(TEMPLATES_PATH, "MLRNStyleFactory.java.ejs"),
    output: path.join(ANDROID_OUTPUT_PATH, "MLRNStyleFactory.java"),
  },
  {
    input: path.join(TEMPLATES_PATH, "getStylePropertyType.ts.ejs"),
    output: path.join(JS_OUTPUT_PATH, "utils", "getStylePropertyType.ts"),
  },
];

async function generate() {
  const androidVersion = await getAndroidVersion();
  const iosVersion = await getIosVersion();

  function getPropertiesForLight() {
    const lightAttributes = maplibreGlStyleSpec.light;

    return getSupportedProperties(lightAttributes).map((attrName) => {
      return Object.assign({}, buildProperties(lightAttributes, attrName), {
        allowedFunctionTypes: [],
      });
    });
  }

  function getPropertiesForLayer(layerName: string) {
    const paintAttributes = maplibreGlStyleSpec[`paint_${layerName}`];
    const layoutAttributes = maplibreGlStyleSpec[`layout_${layerName}`];

    const paintProps = getSupportedProperties(paintAttributes).map(
      (attrName) => {
        const prop = buildProperties(paintAttributes, attrName);

        // overrides
        if (["line-width"].includes(attrName)) {
          prop.allowedFunctionTypes = ["camera"];
        }

        return prop;
      },
    );

    const layoutProps = getSupportedProperties(layoutAttributes).map(
      (attrName) => {
        const prop = buildProperties(layoutAttributes, attrName);

        // overrides
        if (
          [
            "line-join",
            "text-max-width",
            "text-letter-spacing",
            "text-anchor",
            "text-justify",
            "text-font",
          ].includes(attrName)
        ) {
          prop.allowedFunctionTypes = ["camera"];
        }

        // TODO
        // Overide type padding
        if (prop.type === "padding") {
          prop.type = "array";
          prop.value = "number";
          prop.length = 4;
        }

        return prop;
      },
    );

    const props = [...layoutProps, ...paintProps];

    return props.filter((prop) => {
      // TODO: Codegen adoptions for native style code
      // https://github.com/maplibre/maplibre-react-native/issues/562
      return !["textVariableAnchorOffset"].includes(prop.name);
    });
  }

  function getSupportedLayers() {
    return Object.entries(maplibreGlStyleSpec.layer.type.values)
      .map(([layerName, layerProperties]) => {
        if (
          layerProperties &&
          typeof layerProperties === "object" &&
          "sdk-support" in layerProperties
        ) {
          const support = getAttributeSupport(layerProperties["sdk-support"]);

          if (support.basic.android && support.basic.ios) {
            return layerName;
          }
        }

        return undefined;
      })
      .filter((layerName) => typeof layerName === "string");
  }

  function getSupportedProperties(attributes: any) {
    return Object.keys(attributes).filter((attrName) =>
      isAttrSupported(attributes[attrName]),
    );
  }

  function buildProperties(attributes: any, attrName: string) {
    return {
      name: camelCase(attrName),
      doc: {
        default: attributes[attrName].default,
        minimum: attributes[attrName].minimum,
        maximum: attributes[attrName].maximum,
        units: attributes[attrName].units,
        description: formatDescription(attributes[attrName].doc),
        requires: getRequires(attributes[attrName].requires),
        disabledBy: getDisables(attributes[attrName].requires),
        values: attributes[attrName].values,
      },
      type: attributes[attrName].type,
      value: attributes[attrName].value,
      length: undefined as undefined | number,
      image: isImage(attrName),
      translate: isTranslate(attrName),
      transition: attributes[attrName].transition,
      expression: attributes[attrName].expression,
      expressionSupported:
        Object.keys(attributes[attrName].expression || {}).length > 0,
      support: getAttributeSupport(attributes[attrName]["sdk-support"]),
      allowedFunctionTypes: getAllowedFunctionTypes(attributes[attrName]),
    };
  }

  function formatDescription(description: string) {
    const words = description.split(" ");

    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      if (word?.includes("-")) {
        words[i] = camelCase(word);
      }
    }

    return words.join(" ");
  }

  function getRequires(requiredItems: any) {
    const items: any[] = [];

    if (!requiredItems) {
      return items;
    }

    for (const item of requiredItems) {
      if (typeof item === "string") {
        items.push(camelCase(item, "-"));
      }
    }

    return items;
  }

  function getDisables(disabledItems: any[]) {
    const items: any[] = [];

    if (!disabledItems) {
      return items;
    }

    for (const item of disabledItems) {
      if (item["!"]) {
        items.push(camelCase(item["!"], "-"));
      }
    }

    return items;
  }

  function isImage(attrName: string) {
    return (
      attrName.toLowerCase().indexOf("pattern") !== -1 ||
      attrName.toLowerCase().indexOf("image") !== -1
    );
  }

  function isTranslate(attrName: string) {
    return attrName.toLowerCase().indexOf("translate") !== -1;
  }

  function isAttrSupported(attr: any) {
    const support = getAttributeSupport(attr["sdk-support"]);
    if (attr.private) {
      return false;
    }
    return support.basic.android && support.basic.ios;
  }

  function getAttributeSupport(sdkSupport: any) {
    const support = {
      basic: { android: false, ios: false },
      data: { android: false, ios: false },
    };

    const basicSupport = sdkSupport && sdkSupport["basic functionality"];
    support.basic.android = isVersionGTE(androidVersion, basicSupport?.android);
    support.basic.ios = isVersionGTE(iosVersion, basicSupport?.ios);

    const dataDrivenSupport = sdkSupport && sdkSupport["data-driven styling"];
    support.data.android = isVersionGTE(
      androidVersion,
      dataDrivenSupport?.android,
    );
    support.data.ios = isVersionGTE(iosVersion, dataDrivenSupport?.ios);

    if (!support.data.ios || !support.data.android) {
      support.data.ios = false;
      support.data.android = false;
    }

    return support;
  }

  function getAllowedFunctionTypes(paintAttr: any) {
    const allowedFunctionTypes = [];

    if (paintAttr["zoom-function"]) {
      allowedFunctionTypes.push("camera");
    }

    if (paintAttr["property-function"]) {
      allowedFunctionTypes.push("source");
      allowedFunctionTypes.push("composite");
    }

    return allowedFunctionTypes;
  }

  const layers = getSupportedLayers().map((layerName) => {
    return {
      name: layerName,
      properties: getPropertiesForLayer(layerName),
    };
  });

  // add light as a layer
  layers.push({ name: "light", properties: getPropertiesForLight() });

  // autogenerate code
  await Promise.all(
    TEMPLATE_MAPPINGS.map(async ({ input, output }) => {
      const filename = path.parse(output).base;

      console.log(`Generating ${filename}`);
      const template = ejs.compile(await fs.readFile(input, "utf8"), {
        strict: true,
        async: true,
      });
      let results = await template({
        layers,
        filePath: path.relative(path.join(__dirname, ".."), input),
        helpers: TemplateHelpers,
      });
      if (filename.endsWith("ts")) {
        results = await prettier.format(results, {
          filepath: filename,
        });
        // Ensure all enums are exported
        results = results.replace(/enum (\w+Enum) \{[^}]+}\n/g, "export $&");
        // Replace Array<any> with any[]
        results = results.replace(/Array<any>/g, "any[]");
        // Replace padding type with float array
        results = results.replace(/padding: string;/g, "padding: number[];");
      }
      await fs.writeFile(output, results);
    }),
  );

  // autogenerate docs
  const docBuilder = new DocJSONBuilder(layers);
  const markdownBuilder = new MarkdownBuilder();
  await docBuilder.generate();
  await markdownBuilder.generate();

  // Check if any generated files changed
  try {
    execSync(
      `git diff --exit-code docs/ ${TEMPLATE_MAPPINGS.map((m) => m.output).join(" ")}`,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    console.error(
      "\n\nThere are unstaged changes in the generated code. " +
        "Please add them to your commit.\n" +
        'If you would really like to exclude them, run "git commit -n" to skip.\n\n',
    );
    process.exit(1);
  }
}

generate();
