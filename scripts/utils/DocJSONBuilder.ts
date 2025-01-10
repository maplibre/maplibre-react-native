import { exec } from "child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import * as docgen from "react-docgen";
import { parseJsDoc } from "react-docgen/dist/utils";

import { JSDocNodeTree } from "./JSDocNodeTree";
import { pascalCase } from "./TemplateHelpers";

const WORKSPACE_ROOT = path.join(__dirname, "..", "..");

const COMPONENT_DIRECTORY = path.join(WORKSPACE_ROOT, "src", "components");
const MODULES_DIRECTORY = path.join(WORKSPACE_ROOT, "src", "modules");
const OUTPUT_PATH = path.join(WORKSPACE_ROOT, "docs", "content", "docs.json");

const IGNORE_METHODS = ["setNativeProps"];

const fileExtensionsRegex = /.(js|tsx|(?<!d.)ts)$/;

export class DocJSONBuilder {
  _styledLayers: any;

  constructor(styledLayers: any) {
    this._styledLayers = {};

    for (const styleLayer of styledLayers) {
      const ComponentName = pascalCase(styleLayer.name);
      const fakeLayers = ["Light", "Atmosphere", "Terrain"];
      if (fakeLayers.includes(ComponentName)) {
        this._styledLayers[ComponentName] = styleLayer;
      } else {
        this._styledLayers[ComponentName + "Layer"] = styleLayer;
      }
    }
  }

  get options() {
    return {
      match: fileExtensionsRegex,
      shortName: true,
      sort: true,
    };
  }

  isPrivateMethod(methodName = "") {
    return !methodName || methodName.charAt(0) === "_";
  }

  postprocess(component: any, name: string) {
    // Remove all private methods and parse examples from docblock

    if (!Array.isArray(component.methods)) {
      return;
    }

    component.name = name;

    // Main description
    component.description = component.description?.replace(
      /(\n*)(@\w+) (\{.*})/g,
      "",
    );

    // Styles
    if (this._styledLayers[name] && this._styledLayers[name].properties) {
      component.styles = [];

      for (const prop of this._styledLayers[name].properties) {
        const docStyle = {
          name: prop.name,
          type: prop.type,
          values: [] as any[],
          minimum: prop.doc.minimum,
          maximum: prop.doc.maximum,
          units: prop.doc.units,
          default: prop.doc.default,
          description: prop.doc.description,
          requires: prop.doc.requires,
          disabledBy: prop.doc.disabledBy,
          allowedFunctionTypes: prop.allowedFunctionTypes || [],
          expression: prop.expression,
          transition: prop.transition,
        };
        if (prop.type === "enum") {
          docStyle.values = Object.keys(prop.doc.values).map((value) => {
            return { value, doc: prop.doc.values[value].doc };
          });
        } else if (prop.type === "array") {
          docStyle.type = `${prop.value}[]`;
        }

        component.styles.push(docStyle);
      }
    }

    function mapNestedProp(propMeta: any) {
      const result = {
        type: {
          name: propMeta.name,
          value: propMeta.value,
        },
        description: propMeta.description,
        required: propMeta.required,
      };

      if (propMeta.value) {
        result.type.value = propMeta.value;
      }

      return result;
    }

    function tsTypeDesc(tsType: TSType) {
      if (!tsType?.name) {
        return null;
      }

      if (tsType.name === "signature") {
        if (tsType.raw.length < 200) {
          return `${tsType.raw
            .replace(/(\n|\s)/g, "")
            .replace(/(\|)/g, "\\|")}`;
        } else {
          return "FIX ME FORMAT BIG OBJECT";
        }
      } else if (tsType.name === "union") {
        if (tsType.raw) {
          // Props
          return tsType.raw.replace(/\|/g, "\\|");
        } else if (tsType.elements) {
          // Methods
          return tsType.elements.map((element) => element.name).join(" \\| ");
        }
      }

      return tsType.name;
    }

    type TSTypeType = {
      name: string;
      raw: string;
    };

    type TSFuncSignature = {
      arguments: { type: TSType; name: string }[];
      return: TSType;
    };

    type TSKVProperties = { key: string; value: TSType; description: string }[];

    type TSObjectSignature = {
      properties: TSKVProperties;
    };

    interface TSVoidType extends TSTypeType {
      name: "void";
      type: never;
    }

    interface TSUnionType extends TSTypeType {
      name: "union";
      type: never;
      elements: any[];
    }

    interface TSFunctionType extends TSTypeType {
      name: "signature";
      type: "function";
      signature: TSFuncSignature;
    }

    interface TSObjectType extends TSTypeType {
      name: "signature";
      type: "object";
      signature: TSObjectSignature;
    }

    type TSType = TSVoidType | TSUnionType | TSFunctionType | TSObjectType;

    function tsTypeIsFunction(tsType: TSType): tsType is TSFunctionType {
      return "type" in tsType && tsType.type === "function";
    }

    function tsTypeIsObject(tsType: TSType): tsType is TSObjectType {
      return "type" in tsType && tsType.type === "object";
    }

    function tsTypeDump(tsType: TSType): string {
      if (tsTypeIsFunction(tsType)) {
        const { signature } = tsType;
        return `(${signature.arguments
          .map(({ name, type }) => `${name}:${tsTypeDump(type)}`)
          .join(", ")}) => ${tsTypeDump(signature.return)}`;
      } else if (tsTypeIsObject(tsType)) {
        const { signature } = tsType;
        return `{${signature.properties
          .map(({ key, value }) => `${key}: ${tsTypeDump(value)}`)
          .join(", ")}}`;
      } else {
        return tsType.name;
      }
    }

    function tsTypeDescType(tsType?: TSType) {
      if (!tsType) {
        return null;
      }

      if (tsType.name === "signature" && tsType.type === "object") {
        const { properties } = tsType.signature;
        if (properties) {
          const value = properties.map((kv) => {
            return mapProp(
              mapNestedProp({ ...kv.value, description: kv.description }),
              kv.key,
              false,
            );
          });
          return { name: "shape", value };
        } else if (tsType.raw.length < 200) {
          return `${tsType.raw
            .replace(/(\n|\s)/g, "")
            .replace(/(\|)/g, "\\|")}`;
        } else {
          return "FIX ME FORMAT BIG OBJECT";
        }
      } else if (tsType.name === "signature" && tsType.type === "function") {
        return { name: "func", funcSignature: tsTypeDump(tsType) };
      } else if (tsType.name === "union") {
        if (tsType.raw) {
          // Props
          return tsType.raw.replace(/\|/g, "\\|");
        } else if (tsType.elements) {
          // Methods
          return tsType.elements.map((e) => e.name).join(" \\| ");
        }
      }

      return tsType.name;
    }

    function mapProp(
      propMeta: any,
      propName: string | undefined,
      array: boolean,
    ) {
      let result: Record<string, any> = {};
      if (!array) {
        result = {
          name: propName || "FIX ME NO NAME",
          required: propMeta.required || false,
          type:
            propMeta.type?.name ||
            tsTypeDescType(propMeta.tsType) ||
            "FIX ME UNKNOWN TYPE",
          default: !propMeta.defaultValue
            ? "none"
            : propMeta.defaultValue.value.replace(/\n/g, ""),
          description: propMeta.description || "FIX ME NO DESCRIPTION",
        };
        if (
          result.type &&
          result.type.name === "func" &&
          result.type.funcSignature
        ) {
          result.description = `${result.description}\n*signature:*\`${result.type.funcSignature}\``;
        }
      } else {
        if (propName) {
          result.name = propName;
        }
        if (propMeta.required !== undefined) {
          result.required = propMeta.required;
        }
        result.type =
          (propMeta.type && propMeta.type.name) ||
          tsTypeDescType(propMeta.tsType) ||
          "FIX ME UNKNOWN TYPE";
        if (propMeta.defaultValue) {
          result.default = propMeta.defaultValue.value.replace(/\n/g, "");
        }
        if (propMeta.description) {
          result.description = propMeta.description;
        }
      }

      if (
        propMeta.type &&
        propMeta.type.name === "arrayOf" &&
        propMeta.type.value
      ) {
        result.type = {
          name: "array",
          value: mapProp(mapNestedProp(propMeta.type.value), undefined, true),
        };
      }

      if (propMeta.type && propMeta.type.name === "func") {
        const jsdoc = parseJsDoc(propMeta.description);
        if (jsdoc && jsdoc.description) {
          result.description = jsdoc.description;
        }
        if (jsdoc && jsdoc.params && jsdoc.params.length > 0) {
          result.params = jsdoc.params;
        }
        if (jsdoc && jsdoc.returns) {
          result.returns = jsdoc.returns;
        }
      }
      if (
        propMeta.type &&
        propMeta.type.name === "shape" &&
        propMeta.type.value
      ) {
        const type = propMeta.type.value;
        const value = Object.keys(type).map((_name) =>
          mapProp(mapNestedProp(type[_name]), _name, false),
        );
        result.type = { name: "shape", value };
      }
      return result;
    }

    // props
    component.props = Object.keys(component.props).map((propName) => {
      const propMeta = component.props[propName];

      return mapProp(propMeta, propName, false);
    });

    // methods
    const privateMethods: string[] = [];
    for (const method of component.methods) {
      if (this.isPrivateMethod(method.name)) {
        privateMethods.push(method.name);
        continue;
      }

      if (method.docblock) {
        const examples = method.docblock
          .split("@")
          .filter((block: string) => block.startsWith("example"));
        method.examples = examples.map((example: any) =>
          example.substring("example".length),
        );
      }
    }
    privateMethods.push(...IGNORE_METHODS);

    component.methods = component.methods.filter(
      (method: any) => !privateMethods.includes(method.name),
    );

    component.methods.forEach((method: any) => {
      method.params.forEach((param: any) => {
        param.type = { name: tsTypeDesc(param.type) };
      });
    });

    console.log(
      `Processed ${component.name} (${component.props?.length ?? 0} props, ${
        component.methods?.length ?? 0
      } methods)`,
    );
  }

  async generateReactComponentsTask(results: Record<string, any>) {
    const filesNames = await fs.readdir(COMPONENT_DIRECTORY);

    const files = await Promise.all(
      filesNames.map(async (base) => {
        return {
          base,
          content: await fs.readFile(
            path.join(COMPONENT_DIRECTORY, base),
            "utf-8",
          ),
        };
      }),
    );

    files.forEach(({ base, content }) => {
      const parsedComponents = docgen.parse(content, {
        babelOptions: {
          filename: base,
        },
      });

      const [parsed] = parsedComponents;

      results[path.parse(base).name] = {
        ...parsed,
        type: "component",
        filePath: path.relative(
          WORKSPACE_ROOT,
          path.join(COMPONENT_DIRECTORY, base),
        ),
      };

      this.postprocess(results[path.parse(base).name], path.parse(base).name);
    });
  }

  async generateModulesTask(results: Record<string, any>) {
    return new Promise<void>((resolve, reject) => {
      exec(
        `yarn run documentation build ${MODULES_DIRECTORY} -f json`,
        (err, stdout, stderr) => {
          if (err || stderr) {
            reject(err || stderr);
            return;
          }

          const modules = JSON.parse(stdout);
          for (const module of modules) {
            const node = new JSDocNodeTree(module);
            const name = module.name;

            results[name] = {
              name,
              type: "module",
              filePath: path.relative(WORKSPACE_ROOT, module.context.file),
              description: node.getText(),
              props: [],
              styles: [],
              methods: node.getMethods(),
            };
          }

          resolve();
        },
      );
    });
  }

  sortObject(unsorted: Record<string, any>) {
    return Object.keys(unsorted)
      .sort()
      .reduce(
        (acc, key) => ({
          ...acc,
          [key]: unsorted[key],
        }),
        {},
      );
  }

  async generate() {
    const results = {};

    await this.generateReactComponentsTask(results);
    await this.generateModulesTask(results);

    await fs.writeFile(
      OUTPUT_PATH,
      JSON.stringify(this.sortObject(results), null, 2),
    );
  }
}
