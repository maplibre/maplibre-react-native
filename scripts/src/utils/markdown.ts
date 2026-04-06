import type {
  ComponentDocEntry,
  MethodDocEntry,
  ModuleDocEntry,
  PropDocEntry,
  StyleDocEntry,
  TypeDocEntry,
} from "../types/DocEntry";

// ---------------------------------------------------------------------------
// Low-level helpers
// ---------------------------------------------------------------------------

function escapeTableCell(text: string): string {
  return text.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function inlineCode(text: string): string {
  return text ? `\`${text}\`` : "";
}

function tableRow(...cells: string[]): string {
  return `| ${cells.join(" | ")} |\n`;
}

function tableSeparator(cols: number): string {
  return tableRow(...Array<string>(cols).fill(":---"));
}

// ---------------------------------------------------------------------------
// Section renderers
// ---------------------------------------------------------------------------

function propSection(prop: PropDocEntry): string {
  let out = `### \`${prop.name}\`\n\n`;

  if (prop.description) out += `${prop.description}\n\n`;

  const meta: string[] = [
    `**Type:** ${inlineCode(escapeTableCell(prop.type))}`,
  ];
  meta.push(`**Required:** ${prop.required ? "Yes" : "No"}`);
  if (prop.defaultValue)
    meta.push(`**Default:** ${inlineCode(prop.defaultValue)}`);
  out += `${meta.join("  |  ")}\n\n`;

  if (prop.see.length > 0) {
    out += `**See also:** ${prop.see.join(", ")}\n\n`;
  }

  return out;
}

function paramsTable(params: MethodDocEntry["params"]): string {
  if (params.length === 0) return "";
  const header = tableRow("Name", "Type", "Required", "Description");
  const sep = tableSeparator(4);
  const rows = params
    .map((p) =>
      tableRow(
        inlineCode(p.name),
        inlineCode(escapeTableCell(p.type)),
        p.optional ? "No" : "Yes",
        escapeTableCell(p.description),
      ),
    )
    .join("");
  return `${header}${sep}${rows}\n`;
}

function methodSection(method: MethodDocEntry): string {
  const sig = method.params
    .map((p) => (p.optional ? `[${p.name}]` : p.name))
    .join(", ");
  let out = `### \`${method.name}(${sig})\`\n\n`;

  if (method.description) out += `${method.description}\n\n`;

  if (method.params.length > 0) {
    out += `#### Arguments\n\n${paramsTable(method.params)}`;
  }

  if (method.returns && method.returns.type !== "void") {
    out += `**Returns:** ${inlineCode(method.returns.type)}`;
    if (method.returns.description) out += ` — ${method.returns.description}`;
    out += "\n\n";
  }

  for (const ex of method.examples) {
    if (ex.title) out += `**${ex.title}**\n\n`;
    if (ex.content) out += `${ex.content}\n\n`;
  }

  return out;
}

function styleSection(style: StyleDocEntry): string {
  let out = `### \`${style.name}\`\n\n`;

  if (style.description) out += `${style.description}\n\n`;

  const meta: string[] = [`**Type:** ${inlineCode(style.type)}`];
  if (style.default !== undefined) {
    meta.push(`**Default:** ${inlineCode(String(style.default))}`);
  }
  if (style.units) meta.push(`**Units:** ${style.units}`);
  if (style.minimum !== undefined)
    meta.push(`**Min:** ${String(style.minimum)}`);
  if (style.maximum !== undefined)
    meta.push(`**Max:** ${String(style.maximum)}`);
  out += `${meta.join("  |  ")}\n\n`;

  if (style.type === "enum" && style.values.length > 0) {
    out += `**Supported values:**\n\n`;
    for (const v of style.values) {
      out += `- ${inlineCode(v.value)}${v.doc ? ` — ${v.doc}` : ""}\n`;
    }
    out += "\n";
  }

  if (style.requires.length > 0) {
    out += `**Requires:** ${style.requires.map(inlineCode).join(", ")}\n\n`;
  }

  if (style.disabledBy.length > 0) {
    out += `**Disabled by:** ${style.disabledBy.map(inlineCode).join(", ")}\n\n`;
  }

  if (style.allowedFunctionTypes.length > 0) {
    out += `**Supported functions:** ${style.allowedFunctionTypes.map(inlineCode).join(", ")}\n\n`;
  }

  if (style.expression?.parameters && style.expression.parameters.length > 0) {
    out += `**Expression parameters:** ${style.expression.parameters.map(inlineCode).join(", ")}\n\n`;
  }

  if (style.transition) {
    out += `### \`${style.name}Transition\`\n\n`;
    out += `Transition for ${inlineCode(style.name)}. Type: ${inlineCode("{ duration, delay }")} (milliseconds). Default: ${inlineCode("{ duration: 300, delay: 0 }")}\n\n`;
  }

  return out;
}

// ---------------------------------------------------------------------------
// Document renderers
// ---------------------------------------------------------------------------

function frontmatter(filePath: string, sidebarLabel: string): string {
  return `---\n# DO NOT MODIFY\n# This file is auto-generated from ${filePath}\nsidebar_label: ${sidebarLabel}\n---\n\n`;
}

export function renderComponentDoc(component: ComponentDocEntry): string {
  let out = frontmatter(component.filePath, component.name);
  out += `# \`<${component.name} />\`\n\n`;

  if (component.description) out += `${component.description}\n\n`;

  for (const ex of component.examples) {
    if (ex.title) out += `**${ex.title}**\n\n`;
    if (ex.content) out += `${ex.content}\n\n`;
  }

  if (component.composes.length > 0) {
    out += `_Also accepts props from: ${component.composes.map(inlineCode).join(", ")}_\n\n`;
  }

  if (component.props.length > 0) {
    out += `## Props\n\n`;
    for (const prop of component.props) {
      out += propSection(prop);
    }
  }

  if (component.methods.length > 0) {
    out += `## Ref Methods\n\n`;
    for (const method of component.methods) {
      out += methodSection(method);
    }
  }

  if (component.styles && component.styles.length > 0) {
    out += `## Styles\n\n`;
    for (const style of component.styles) {
      out += styleSection(style);
    }
  }

  return out;
}

export function renderModuleDoc(mod: ModuleDocEntry): string {
  let out = frontmatter(mod.filePath, mod.name);
  out += `# ${mod.name}\n\n`;

  if (mod.description) out += `${mod.description}\n\n`;

  if (mod.methods.length > 0) {
    out += `## Methods\n\n`;
    for (const method of mod.methods) {
      out += methodSection(method);
    }
  }

  return out;
}

export function renderTypeDoc(t: TypeDocEntry): string {
  let out = frontmatter(t.filePath, t.name);
  out += `# ${t.name}\n\n`;

  if (t.description) out += `${t.description}\n\n`;

  out += `## Type\n\n\`\`\`typescript\n${t.type}\n\`\`\`\n`;

  return out;
}
