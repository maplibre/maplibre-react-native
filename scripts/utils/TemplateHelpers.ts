const iosPropNameOverrides: Record<string, string> = {};

const iosSpecOverrides: Record<string, string> = {
  "icon-allow-overlap": "icon-allows-overlap",
  "icon-image": "icon-image-name",
  "icon-ignore-placement": "icon-ignores-placement",
  "icon-keep-upright": "keeps-icon-upright",
  "icon-rotate": "icon-rotation",
  "icon-size": "icon-scale",
  "symbol-avoid-edges": "symbol-avoids-edges",
  "text-allow-overlap": "text-allows-overlap",
  "text-field": "text",
  "text-font": "text-font-names",
  "text-ignore-placement": "text-ignores-placement",
  "text-justify": "text-justification",
  "text-keep-upright": "keeps-text-upright",
  "text-max-angle": "maximum-text-angle",
  "text-max-width": "maximum-text-width",
  "text-rotate": "text-rotation",
  "text-size": "text-font-size",
  "circle-pitch-scale": "circle-scale-alignment",
  "circle-translate": "circle-translation",
  "circle-translate-anchor": "circle-translation-anchor",
  "fill-antialias": "fill-antialiased",
  "fill-translate": "fill-translation",
  "fill-translate-anchor": "fill-translation-anchor",
  "fill-extrusion-translate": "fill-extrusion-translation",
  "fill-extrusion-translate-anchor": "fill-extrusion-translation-anchor",
  "raster-brightness-min": "minimum-raster-brightness",
  "raster-brightness-max": "maximum-raster-brightness",
  "raster-hue-rotate": "raster-hue-rotation",
  "line-dasharray": "line-dash-pattern",
  "line-translate": "line-translation",
  "line-translate-anchor": "line-translation-anchor",
  "icon-translate": "icon-translation",
  "icon-translate-anchor": "icon-translation-anchor",
  "text-translate": "text-translation",
  "text-translate-anchor": "text-translation-anchor",
  "raster-resampling": "raster-resampling-mode",
  "text-writing-mode": "text-writing-modes",
};

export function exists<T>(value: T): value is NonNullable<T> {
  return typeof value !== "undefined" && value !== null;
}

export function getValue(value: any, defaultValue: any) {
  if (!exists(value) || value === "") {
    return defaultValue;
  }
  return value;
}

export function camelCase(str: string, delimiter = "-") {
  const parts = str.split(delimiter);
  return parts
    .map((part, index) => {
      if (index === 0) {
        return part;
      }
      return part.charAt(0).toUpperCase() + part.substring(1);
    })
    .join("");
}

export function pascalCase(str: string, delimiter = "-") {
  const parts = str.split(delimiter);
  return parts
    .map((part) => {
      return part.charAt(0).toUpperCase() + part.substring(1);
    })
    .join("");
}

export function setLayerMethodName(layer: any, platform: "android" | "ios") {
  if (platform === "ios") {
    return `${camelCase(layer.name)}Layer`;
  }
  return `set${pascalCase(layer.name)}LayerStyle`;
}

export function getLayerType(layer: any, platform: "android" | "ios") {
  const isIOS = platform === "ios";

  switch (layer.name) {
    case "fill":
      return isIOS ? "MLNFillStyleLayer" : "FillLayer";
    case "fill-extrusion":
      return isIOS ? "MLNFillExtrusionStyleLayer" : "FillExtrusionLayer";
    case "line":
      return isIOS ? "MLNLineStyleLayer" : "LineLayer";
    case "symbol":
      return isIOS ? "MLNSymbolStyleLayer" : "SymbolLayer";
    case "circle":
      return isIOS ? "MLNCircleStyleLayer" : "CircleLayer";
    case "background":
      return isIOS ? "MLNBackgroundStyleLayer" : "BackgroundLayer";
    case "raster":
      return isIOS ? "MLNRasterStyleLayer" : "RasterLayer";
    case "heatmap":
      return isIOS ? "MLNHeatmapStyleLayer" : "HeatmapLayer";
    case "hillshade":
      return isIOS ? "MLNHillshadeStyleLayer" : "HillshadeLayer";
    case "light":
      return isIOS ? "MLNLight" : "Light";
    default:
      throw new Error(
        `Is ${layer.name} a new layer? We should add support for it!`,
      );
  }
}

export function ifOrElseIf(index: number) {
  if (index === 0) {
    return "if";
  }
  return "} else if";
}

export function iosStringArrayLiteral(array: string[]) {
  return `@[@${array.map((item) => `"${item}"`).join(", @")}]`;
}

export function iosPropName(name: string) {
  if (name.indexOf("visibility") !== -1) {
    return "visible";
  }
  if (name === "fillExtrusionVerticalGradient") {
    return "fillExtrusionHasVerticalGradient";
  }
  if (iosPropNameOverrides[name]) {
    return iosPropNameOverrides[name];
  }
  return name;
}

export function iosMapLibrePropName(name: string) {
  const result = iosPropName(name);
  if (result === "fillExtrusionVerticalGradient") {
    return "fillExtrusionHasVerticalGradient";
  }
  return undefined;
}

export function iosPropMethodName(layer: any, name: string) {
  if (name.indexOf("Visibility") !== -1) {
    return pascalCase(layer.name) + "StyleLayer" + name;
  }
  return name;
}

export function androidInputType(type: string, value?: string): string {
  if (type === "array" && value) {
    return `${androidInputType(value)}[]`;
  }

  switch (type) {
    case "color":
      return "Integer";
    case "boolean":
      return "Boolean";
    case "number":
      return "Float";
    default:
      return "String";
  }
}

export function androidOutputType(type: string, value?: any): string {
  if (type === "array" && value) {
    return `${androidOutputType(value)}[]`;
  }

  switch (type) {
    case "color":
      return "String";
    case "boolean":
      return "Boolean";
    case "number":
      return "Float";
    default:
      return "String";
  }
}

export function androidGetConfigType(androidType: string, prop: any) {
  switch (androidType) {
    case "Integer":
      return "styleValue.getInt(VALUE_KEY)";
    case "Float":
      return "styleValue.getFloat(VALUE_KEY)";
    case "Boolean":
      return "styleValue.getBoolean(VALUE_KEY)";
    case "Float[]":
      return "styleValue.getFloatArray(VALUE_KEY)";
    case "String[]":
      return "styleValue.getStringArray(VALUE_KEY)";
    default:
      if (prop && prop.image) {
        return "styleValue.getImageURI()";
      } else {
        return "styleValue.getString(VALUE_KEY)";
      }
  }
}

export function jsStyleType(prop: any) {
  if (prop.type === "color") {
    return "StyleTypes.Color";
  }

  if (prop.type === "enum") {
    return "StyleTypes.Enum";
  }

  if (prop.type === "string" && prop.image) {
    return "StyleTypes.Image";
  }

  if (prop.type === "resolvedImage") {
    return "StyleTypes.Image";
  }

  if (prop.name.indexOf("Translate") !== -1) {
    return "StyleTypes.Translation";
  }

  return "StyleTypes.Constant";
}

export function jsDocPropRequires(prop: any) {
  if (!prop.doc.requires) {
    return;
  }

  let desc = "";
  for (const item of prop.doc.requires) {
    if (typeof item === "string") {
      desc += item + ", ";
    }
  }

  return desc;
}

export function getEnums(layers: any[]) {
  const result: Record<string, any> = {};

  layers.forEach((layer) => {
    layer.properties.forEach((property: any) => {
      if (
        property.type === "enum" ||
        (property.type === "array" && property.value === "enum")
      ) {
        result[property.name] = {
          values: property.doc.values,
          name: property.name,
        };
      }
    });
  });
  return Object.values(result);
}

export function dtsInterfaceType(prop: any) {
  const propTypes: string[] = [];

  if (prop.name.indexOf("Translate") !== -1 && prop.type !== "enum") {
    propTypes.push("Translation");
  } else if (prop.type === "color") {
    propTypes.push("string");
    // propTypes.push('ConstantPropType');
  } else if (prop.type === "array") {
    switch (prop.value) {
      case "number":
        propTypes.push("number[]");
        break;
      case "boolean":
        propTypes.push("boolean[]");
        break;
      case "string":
        propTypes.push("string[]");
        break;
      case "enum":
        propTypes.push(
          `Enum<${pascalCase(prop.name)}Enum, ${pascalCase(
            prop.name,
          )}EnumValues>[]`,
        );
        break;
    }
    // propTypes.push('ConstantPropType');
  } else if (prop.type === "number") {
    propTypes.push("number");
  } else if (prop.type === "enum") {
    propTypes.push(
      `Enum<${pascalCase(prop.name)}Enum, ${pascalCase(prop.name)}EnumValues>`,
    );
  } else if (prop.type === "boolean") {
    propTypes.push("boolean");
  } else if (prop.type === "resolvedImage") {
    propTypes.push("ResolvedImageType");
  } else if (prop.type === "formatted") {
    propTypes.push("FormattedString");
  } else if (prop.type === "string") {
    propTypes.push("string");
  } else {
    console.error("Unexpected type:", prop.type);
    throw new Error(`Unexpected type: ${prop.type} for ${prop.name}`);
  }

  /*
  if (prop.allowedFunctionTypes && prop.allowedFunctionTypes.length > 0) {
    propTypes.push('StyleFunctionProps');
  }
  */

  if (propTypes.length > 1) {
    return `${propTypes.map((p) => startAtSpace(4, p)).join(" | ")},
${startAtSpace(2, "")}`;
  } else {
    if (prop.expressionSupported) {
      let params = "";
      if (prop.expression && prop.expression.parameters) {
        params = `,[${prop.expression.parameters
          .map((v: string) => `'${v}'`)
          .join(",")}]`;
      }
      return `Value<${propTypes[0]}${params}>`;
    } else {
      return propTypes[0];
    }
  }
}

export function jsDocReactProp(prop: any) {
  const propTypes = [];

  if (prop.type === "color") {
    propTypes.push("PropTypes.string");
  } else if (prop.type === "array") {
    switch (prop.value) {
      case "number":
        propTypes.push("PropTypes.arrayOf(PropTypes.number)");
        break;
      case "boolean":
        propTypes.push("PropTypes.arrayOf(PropTypes.bool)");
        break;
      case "string":
        propTypes.push("PropTypes.arrayOf(PropTypes.string)");
        break;
      default:
        propTypes.push("PropTypes.array");
    }
  } else if (prop.type === "number") {
    propTypes.push("PropTypes.number");
  } else if (prop.type === "boolean") {
    propTypes.push("PropTypes.bool");
  } else if (prop.type === "enum") {
    if (prop.doc.values) {
      propTypes.push(
        `PropTypes.oneOf([${Object.keys(prop.doc.values)
          .map((v) => `'${v}'`)
          .join(", ")}])`,
      );
    } else {
      propTypes.push("PropTypes.any");
    }
  } else {
    // images can be required which result in a number
    if (prop.image) {
      propTypes.push("PropTypes.number");
    }
    propTypes.push("PropTypes.string");
  }

  if (prop.expressionSupported && !propTypes.includes("PropTypes.array")) {
    propTypes.push("PropTypes.array");
  }

  if (propTypes.length > 1) {
    return `PropTypes.oneOfType([
${propTypes.map((p) => startAtSpace(4, p)).join(",\n")},
${startAtSpace(2, "])")}`;
  } else {
    return propTypes[0];
  }
}

export function startAtSpace(spaceCount: number, str: string) {
  let value = "";

  for (let i = 0; i < spaceCount; i++) {
    value += " ";
  }

  return `${value}${str}`;
}

export function replaceNewLine(str: string) {
  return str?.replace(/\n/g, "<br/>");
}

export function styleMarkdownTableRow(style: any) {
  return `| \`${style.name}\` | \`${style.type}\` | \`${
    style.requires.join(", ") || "none"
  }\` | \`${style.disabledBy.join(", ") || "none"}\` | ${replaceNewLine(
    style.description,
  )} |`;
}

export function methodMarkdownTableRow(method: any) {
  return method.params
    .map((param: any) => {
      return `| \`${param.name}\` | \`${
        (param.type && param.type.name) || "n/a"
      }\` | \`${param.optional ? "No" : "Yes"}\` | ${replaceNewLine(
        param.description,
      )} |`;
    })
    .join("\n");
}

function _propMarkdownTableRows(props: any[], prefix = "") {
  return props
    .map((prop) => {
      let { type } = prop;
      if (typeof type === "object") {
        type = type.name;
      }
      const defaultValue = prop.default || "";
      const { description = "" } = prop;

      let result = `| ${prefix}${
        prop.name
      } | \`${type.replace(/^\\\| /, "").replace(/\n/g, " ")}\` | \`${defaultValue}\` | \`${
        prop.required
      }\` | ${replaceNewLine(description)} |`;

      if (type === "shape") {
        result = `${result}\n${_propMarkdownTableRows(
          prop.type.value,
          `&nbsp;&nbsp;${prefix}`,
        )}`;
      }

      return result;
    })
    .join("\n");
}

export function propMarkdownTableRows(component: any) {
  return _propMarkdownTableRows(component.props, "");
}

export function getMarkdownMethodSignature(method: any) {
  const params = method.params
    .map((param: any, i: number) => {
      const isOptional = param.optional;

      let name = "";

      if (i !== 0) {
        name += ", ";
      }

      name += param.name;
      return isOptional ? `[${name}]` : name;
    })
    .join("");

  return `${method.name}(${params})`;
}

export function getMarkdownMethodExamples(method: any) {
  if (method.examples == null) {
    return null;
  }
  return method.examples
    .map((example: string) => {
      return `

\`\`\`javascript
${example.trim()}
\`\`\`

`;
    })
    .join("");
}

export function getStyleDefaultValue(style: any) {
  if (style.type === "string" && style.default === "") {
    return "empty string";
  } else if (style.type.includes("array")) {
    return `[${style.default}]`;
  } else {
    return style.default;
  }
}

Object.keys(iosSpecOverrides).forEach((propName) => {
  const camelCasePropName = camelCase(propName);
  iosPropNameOverrides[camelCasePropName] = camelCase(
    iosSpecOverrides[propName],
  );
});
