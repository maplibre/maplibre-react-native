import type {
  ComponentDocEntry,
  MethodDocEntry,
  ModuleDocEntry,
  PropDocEntry,
  TypeDocEntry,
} from "./DocEntry";

function inlineCode(text: string): string {
  return text ? `\`${text}\`` : "";
}

function typeField(type: string): string {
  if (type.includes("\n")) {
    return `**Type:**\n\n\`\`\`ts\n${type}\n\`\`\``;
  }
  return `**Type:** ${inlineCode(type)}`;
}

/**
 * Renders a named field (prop or method argument) as a heading + metadata line.
 * `headingLevel` controls the `#` depth (3 for props, 4 for method arguments).
 */
function fieldSection(
  name: string,
  type: string,
  required: boolean,
  description: string,
  headingLevel: number,
  defaultValue?: string,
  see?: string[],
): string {
  const heading = "#".repeat(headingLevel);
  let out = `${heading} \`${name}\`\n\n`;

  if (description) out += `${description}\n\n`;

  const meta: string[] = [typeField(type)];

  meta.push(`**Required:** ${required ? "Yes" : "No"}`);

  if (defaultValue !== undefined && defaultValue !== null) {
    meta.push(`**Default:** ${inlineCode(defaultValue)}`);
  }

  out += `${meta.join("\n\n")}\n\n`;

  if (see && see.length > 0) {
    out += `**See also:** ${see.join(", ")}\n\n`;
  }

  return out;
}

function propSection(prop: PropDocEntry): string {
  return fieldSection(
    prop.name,
    prop.type,
    prop.required,
    prop.description,
    3,
    prop.defaultValue,
    prop.see,
  );
}

function methodSection(method: MethodDocEntry): string {
  const sig = method.params
    .map((p) => (p.optional ? `[${p.name}]` : p.name))
    .join(", ");
  let out = `### \`${method.name}(${sig})\`\n\n`;

  if (method.description) out += `${method.description}\n\n`;

  for (const param of method.params) {
    out += fieldSection(
      param.name,
      param.type,
      !param.optional,
      param.description,
      4,
    );
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

function renderFrontmatter(
  filePath: string,
  sidebarLabel: string,
  sidebarPosition?: number,
): string {
  let fm = `---\n# DO NOT MODIFY\n# This file is auto-generated from ${filePath}\nsidebar_label: ${sidebarLabel}\n`;
  if (sidebarPosition !== undefined)
    fm += `sidebar_position: ${sidebarPosition}\n`;
  fm += `---\n\n`;
  return fm;
}

function typesSection(types: TypeDocEntry[]): string {
  if (types.length === 0) return "";
  let out = `## Types\n\n`;
  for (const t of types) {
    out += `### \`${t.name}\`\n\n`;
    if (t.description) out += `${t.description}\n\n`;
    out += `\`\`\`ts\n${t.type}\n\`\`\`\n\n`;
  }
  return out;
}

export function renderComponentDoc(
  component: ComponentDocEntry,
  sidebarPosition?: number,
): string {
  let out = renderFrontmatter(
    component.filePath,
    component.name,
    sidebarPosition,
  );
  out += `# ${component.name}\n\n`;

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

  out += typesSection(component.types);

  return out;
}

export function renderModuleDoc(mod: ModuleDocEntry): string {
  let out = renderFrontmatter(mod.filePath, mod.name);
  out += `# ${mod.name}\n\n`;

  if (mod.description) out += `${mod.description}\n\n`;

  if (mod.methods.length > 0) {
    out += `## Methods\n\n`;
    for (const method of mod.methods) {
      out += methodSection(method);
    }
  }

  out += typesSection(mod.types);

  return out;
}

export function renderTypeDoc(t: TypeDocEntry): string {
  let out = renderFrontmatter(t.filePath, t.name);
  out += `# ${t.name}\n\n`;

  if (t.description) out += `${t.description}\n\n`;

  out += `## Type\n\n\`\`\`ts\n${t.type}\n\`\`\`\n`;

  return out;
}
