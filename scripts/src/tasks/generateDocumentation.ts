import { promises as fs } from "node:fs";
import path from "node:path";
import prettier from "prettier";

import { analyzeComponents } from "../utils/documentation/analyzeComponents";
import { analyzeModules } from "../utils/documentation/analyzeModules";
import { analyzeTypes } from "../utils/documentation/analyzeTypes";
import {
  renderComponentDoc,
  renderModuleDoc,
  renderTypeDoc,
} from "../utils/documentation/markdown";
import { PACKAGE_PATH, ROOT_PATH } from "../utils/pathes";

const DOCS_CONTENT_PATH = path.join(ROOT_PATH, "docs", "content");

const ANNOTATION_COMPONENTS = [
  "Callout",
  "LayerAnnotation",
  "Marker",
  "UserLocation",
  "ViewAnnotation",
];

const COMPONENT_SIDEBAR_POSITIONS: Record<string, number> = {
  Map: 1,
  Camera: 2,
  Layer: 4,
  Images: 5,
};

function toKebab(name: string): string {
  return name
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

function componentOutputDir(name: string): string {
  if (name.includes("Source")) return "sources";
  if (ANNOTATION_COMPONENTS.includes(name)) return "annotations";

  return "";
}

/** Remove all *.md files from a directory, leaving other files (e.g. _category_.json) intact. */
async function cleanMarkdownFiles(dir: string): Promise<void> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    await Promise.all(
      entries
        .filter((e) => e.isFile() && e.name.endsWith(".md"))
        .map((e) => fs.unlink(path.join(dir, e.name))),
    );
  } catch {
    // directory doesn't exist yet — nothing to clean
  }
}

async function writeMarkdown(filePath: string, content: string): Promise<void> {
  const formatted = await prettier.format(content, {
    ...(await prettier.resolveConfig(process.cwd())),
    parser: "markdown",
  });
  await fs.writeFile(filePath, formatted);
}

export async function generateDocumentation(): Promise<void> {
  const [components, modules, types] = await Promise.all([
    analyzeComponents(
      path.join(PACKAGE_PATH, "src", "components"),
      PACKAGE_PATH,
    ),
    analyzeModules(path.join(PACKAGE_PATH, "src", "modules"), PACKAGE_PATH),
    analyzeTypes(path.join(PACKAGE_PATH, "src", "types"), PACKAGE_PATH),
  ]);

  await Promise.all(
    [
      ...["", "sources", "annotations"].map((sub) =>
        path.join(DOCS_CONTENT_PATH, "components", sub),
      ),
      path.join(DOCS_CONTENT_PATH, "modules"),
      path.join(DOCS_CONTENT_PATH, "types"),
    ].map(cleanMarkdownFiles),
  );

  await Promise.all([
    ...components.map(async (component) => {
      const subDir = componentOutputDir(component.name);
      const dir = path.join(DOCS_CONTENT_PATH, "components", subDir);
      await fs.mkdir(dir, { recursive: true });
      const sidebarPosition =
        subDir === "" ? COMPONENT_SIDEBAR_POSITIONS[component.name] : undefined;
      await writeMarkdown(
        path.join(dir, `${toKebab(component.name)}.md`),
        renderComponentDoc(component, sidebarPosition),
      );
    }),
    ...modules.map(async (mod) => {
      const dir = path.join(DOCS_CONTENT_PATH, "modules");
      await fs.mkdir(dir, { recursive: true });
      await writeMarkdown(
        path.join(dir, `${toKebab(mod.name)}.md`),
        renderModuleDoc(mod),
      );
    }),
    ...types.map(async (t) => {
      const dir = path.join(DOCS_CONTENT_PATH, "types");
      await fs.mkdir(dir, { recursive: true });
      await writeMarkdown(
        path.join(dir, `${toKebab(t.name)}.md`),
        renderTypeDoc(t),
      );
    }),
  ]);

  console.log(
    `Documentation generated: ${components.length} components, ${modules.length} modules, ${types.length} types`,
  );
}
