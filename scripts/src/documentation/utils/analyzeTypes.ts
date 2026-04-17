import { promises as fs } from "fs";
import path from "node:path";
import ts from "typescript";

import type { TypeDocEntry } from "./DocEntry";
import { getLeadingJsDoc } from "./analyzerUtils";
import { parseTsDoc } from "./parseTsDoc";

const TYPES_CODEGEN_DIR = "codegen";
const TYPES_SKIP_NAMES = new Set(["MapLibreRNStyles"]);

function analyzeTypeFile(
  filePath: string,
  packageRoot: string,
): TypeDocEntry | undefined {
  const baseName = path.parse(filePath).name;
  const sourceText = require("fs").readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  for (const statement of sourceFile.statements) {
    const isExported =
      (ts.canHaveModifiers(statement)
        ? ts.getModifiers(statement)
        : undefined
      )?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;

    if (!isExported) continue;

    let name: string | undefined;
    let typeText: string | undefined;

    if (ts.isTypeAliasDeclaration(statement)) {
      name = statement.name.text;
      typeText = statement.type.getText(sourceFile).trim();
    } else if (ts.isInterfaceDeclaration(statement)) {
      name = statement.name.text;
      const membersText = statement.members
        .map((m) => "  " + m.getText(sourceFile))
        .join("\n");
      const heritageClause = statement.heritageClauses
        ?.map((hc) => hc.getText(sourceFile))
        .join(" ");
      const prefix = heritageClause
        ? `interface ${name} ${heritageClause} `
        : "";
      typeText = `${prefix}{\n${membersText}\n}`;
    }

    if (!name || !typeText) continue;
    if (name !== baseName) continue;
    if (TYPES_SKIP_NAMES.has(name)) continue;

    const rawComment = getLeadingJsDoc(sourceFile, statement);
    if (!rawComment) continue;

    const parsed = parseTsDoc(rawComment);
    if (!parsed.description) continue;

    return {
      name,
      filePath: path.relative(packageRoot, filePath),
      description: parsed.description,
      type: typeText,
    };
  }

  return undefined;
}

export async function analyzeTypes(
  typesDirectory: string,
  packageRoot: string,
): Promise<TypeDocEntry[]> {
  const entries = await fs.readdir(typesDirectory, {
    withFileTypes: true,
    recursive: false,
  });

  const results: TypeDocEntry[] = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".ts")) continue;
    if (entry.name === TYPES_CODEGEN_DIR) continue;

    const filePath = path.join(entry.parentPath, entry.name);
    const doc = analyzeTypeFile(filePath, packageRoot);
    if (doc) {
      results.push(doc);
      console.log(`Analyzed type ${doc.name}`);
    }
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}
