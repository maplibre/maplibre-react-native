import type { validateStyleMin } from "@maplibre/maplibre-gl-style-spec";
import _maplibreGlStyleSpec from "@maplibre/maplibre-gl-style-spec/src/reference/latest";
import { exec } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import prettier from "prettier";

import { PACKAGE_PATH, ROOT_PATH } from "../utils/pathes";
import { render as renderMLRNStyleFactoryJava } from "./android/renderMLRNStyleFactory";
import { renderMLRNStyleH, renderMLRNStyle } from "./ios/renderMLRNStyle";
import { render as renderGetStylePropertyType } from "./ts/renderGetStylePropertyType";
import { render as renderMapLibreRNStyles } from "./ts/renderMapLibreRNStyles";
import type { LayerProperty } from "./types/LayerProperty";
import { camelCase } from "./utils/camelCase";
import {
  getAndroidVersion,
  getIosVersion,
  isVersionGTE,
} from "./utils/getNativeVersion";

type StyleSpec = NonNullable<Parameters<typeof validateStyleMin>[1]>;
type LayerType = keyof StyleSpec["layer"]["type"]["values"];
type SdkSupport = {
  "basic functionality": { android: string; ios: string };
  "data-driven styling"?: { android?: string; ios?: string };
};
type RequiresItem = string | Record<string, unknown>;
type SpecProperty = {
  type: string;
  doc: string;
  default?: unknown;
  minimum?: number;
  maximum?: number;
  units?: string;
  requires?: RequiresItem[];
  values?: Record<string, unknown>;
  transition?: boolean;
  expression?: {
    interpolated?: boolean;
    parameters?: string[];
  };
  "sdk-support": SdkSupport;
  private?: boolean;
  value?: string;
};

const maplibreGlStyleSpec = _maplibreGlStyleSpec as StyleSpec;

const execAsync = promisify(exec);

async function runNativeFormatters() {
  const commands = ["yarn format:clang-format", "yarn format:ktlint"];

  await Promise.all(
    commands.map((cmd) =>
      execAsync(cmd, { cwd: PACKAGE_PATH }).catch(() => {}),
    ),
  );
}

const TEMPLATES_PATH = path.join(__dirname, "..", "templates");

const IOS_OUTPUT_PATH = path.join(
  PACKAGE_PATH,
  "ios",
  "components",
  "layer",
  "style",
);

const ANDROID_OUTPUT_PATH = path.join(
  PACKAGE_PATH,
  "android",
  "src",
  "main",
  "java",
  "org",
  "maplibre",
  "reactnative",
  "components",
  "layer",
  "style",
);

const PACKAGE_SRC_PATH = path.join(PACKAGE_PATH, "src");

const TEMPLATE_MAPPINGS = [
  {
    render: renderMapLibreRNStyles,
    templatePath: path.join(TEMPLATES_PATH, "renderMapLibreRNStyles.ts"),
    output: path.join(PACKAGE_SRC_PATH, "types", "MapLibreRNStyles.ts"),
  },
  {
    render: renderGetStylePropertyType,
    templatePath: path.join(TEMPLATES_PATH, "renderGetStylePropertyType.ts"),
    output: path.join(PACKAGE_SRC_PATH, "utils", "getStylePropertyType.ts"),
  },
  {
    render: renderMLRNStyleFactoryJava,
    templatePath: path.join(TEMPLATES_PATH, "renderMLRNStyleFactory.ts"),
    output: path.join(ANDROID_OUTPUT_PATH, "MLRNStyleFactory.java"),
  },
  {
    render: renderMLRNStyleH,
    templatePath: path.join(TEMPLATES_PATH, "renderMLRNStyle.ts"),
    output: path.join(IOS_OUTPUT_PATH, "MLRNStyle.h"),
  },
  {
    render: renderMLRNStyle,
    templatePath: path.join(TEMPLATES_PATH, "renderMLRNStyle.ts"),
    output: path.join(IOS_OUTPUT_PATH, "MLRNStyle.m"),
  },
];

export async function generateStyles() {
  const androidVersion = await getAndroidVersion();
  const iosVersion = await getIosVersion();

  function getPropertiesForLight() {
    const lightSpecProperties = maplibreGlStyleSpec.light;

    return getSupportedProperties(lightSpecProperties).map((propertyName) => {
      return Object.assign(
        {},
        buildProperties(lightSpecProperties, propertyName),
      );
    });
  }

  function getPropertiesForLayer(layerType: LayerType) {
    const specPaintProperties = maplibreGlStyleSpec[`paint_${layerType}`];
    const specLayoutProperties = maplibreGlStyleSpec[`layout_${layerType}`];

    const paintProps = getSupportedProperties(specPaintProperties).map(
      (propertyName) => {
        return buildProperties(specPaintProperties, propertyName);
      },
    );

    const layoutProperties = getSupportedProperties(specLayoutProperties).map(
      (propertyName) => {
        const prop = buildProperties(specLayoutProperties, propertyName);

        // TODO
        // Override type padding
        if (prop.type === "padding") {
          prop.type = "array";
          prop.value = "number";
          prop.length = 4;
        }

        return prop;
      },
    );

    const properties = [...layoutProperties, ...paintProps];

    return properties.filter((property) => {
      // TODO: Codegen adoptions for native style code
      // https://github.com/maplibre/maplibre-react-native/issues/562
      return !["textVariableAnchorOffset"].includes(property.name);
    });
  }

  function getSupportedLayers(): LayerType[] {
    return (
      Object.keys(maplibreGlStyleSpec.layer.type.values) as LayerType[]
    ).filter((layerType) => {
      const support = getAttributeSupport(
        maplibreGlStyleSpec.layer.type.values[layerType]["sdk-support"],
      );

      return support.basic.android && support.basic.ios;
    });
  }

  function getSupportedProperties(
    specProperties: Record<string, SpecProperty>,
  ): string[] {
    return Object.entries(specProperties)
      .filter(([, attr]) => isAttrSupported(attr))
      .map(([name]) => name);
  }

  function buildProperties(
    specProperties: Record<string, SpecProperty>,
    propertyName: string,
  ): LayerProperty {
    const property = specProperties[propertyName]!;
    return {
      name: camelCase(propertyName),
      doc: {
        default: property.default,
        minimum: property.minimum,
        maximum: property.maximum,
        units: property.units,
        description: formatDescription(property.doc),
        requires: getRequires(property.requires),
        disabledBy: getDisables(property.requires),
        values: property.values ?? {},
      },
      type: property.type,
      value: property.value,
      length: undefined as undefined | number,
      image: isImage(propertyName),
      translate: isTranslate(propertyName),
      transition: property.transition,
      expression: property.expression,
      expressionSupported: Object.keys(property.expression ?? {}).length > 0,
      support: getAttributeSupport(property["sdk-support"]),
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

  function getRequires(requiredItems: RequiresItem[] | undefined): string[] {
    if (!requiredItems) {
      return [];
    }
    return requiredItems.flatMap((item) =>
      typeof item === "string" ? [camelCase(item, "-")] : [],
    );
  }

  function getDisables(disabledItems: RequiresItem[] | undefined): string[] {
    if (!disabledItems) {
      return [];
    }
    return disabledItems.flatMap((item) =>
      typeof item !== "string" && typeof item["!"] === "string"
        ? [camelCase(item["!"], "-")]
        : [],
    );
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

  function isAttrSupported(attr: SpecProperty): boolean {
    if (attr.private) {
      return false;
    }
    const support = getAttributeSupport(attr["sdk-support"]);
    return support.basic.android && support.basic.ios;
  }

  function getAttributeSupport(sdkSupport: SdkSupport) {
    return {
      basic: {
        android: isVersionGTE(
          androidVersion,
          sdkSupport["basic functionality"].android,
        ),
        ios: isVersionGTE(iosVersion, sdkSupport["basic functionality"].ios),
      },
      data: {
        android: isVersionGTE(
          androidVersion,
          sdkSupport["data-driven styling"]?.android,
        ),
        ios: isVersionGTE(iosVersion, sdkSupport["data-driven styling"]?.ios),
      },
    };
  }

  const layers = [
    ...getSupportedLayers().map((layerType) => ({
      name: layerType,
      properties: getPropertiesForLayer(layerType),
    })),
    { name: "light" as const, properties: getPropertiesForLight() },
  ];

  // autogenerate code
  await Promise.all(
    TEMPLATE_MAPPINGS.map(async ({ render, templatePath, output }) => {
      const filename = path.parse(output).base;

      console.log(`Generating ${filename}`);
      let results = render(layers, path.relative(ROOT_PATH, templatePath));

      if (filename.endsWith(".ts")) {
        results = await prettier.format(results, {
          ...(await prettier.resolveConfig(output)),
          filepath: output,
        });
      }

      await fs.writeFile(output, results);
    }),
  );

  await runNativeFormatters();
}
