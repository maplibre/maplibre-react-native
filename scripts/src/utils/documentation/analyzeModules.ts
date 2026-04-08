import { promises as fs } from "node:fs";
import * as path from "node:path";
import ts from "typescript";

import {
  collectColocatedTypes,
  extractMethodsFromMembers,
  getLeadingJsDoc,
} from "./analyzerUtils";
import { parseTsDoc } from "./parseTsDoc";
import type { ModuleDocEntry } from "../../types/DocEntry";

function analyzeModuleFile(
  filePath: string,
  packageRoot: string,
): ModuleDocEntry | undefined {
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
    if (!ts.isClassDeclaration(statement)) continue;
    if (!statement.name) continue;
    const name = statement.name.text;
    if (name !== baseName) continue;

    const rawComment = getLeadingJsDoc(sourceFile, statement);
    const parsed = rawComment ? parseTsDoc(rawComment) : undefined;

    const methods = extractMethodsFromMembers(statement.members, sourceFile);

    const types = collectColocatedTypes(
      sourceFile,
      filePath,
      packageRoot,
      new Set<string>([name]),
    );

    return {
      name,
      filePath: path.relative(packageRoot, filePath),
      description: parsed?.description ?? "",
      methods,
      types,
    };
  }

  return undefined;
}

export async function analyzeModules(
  modulesDirectory: string,
  packageRoot: string,
): Promise<ModuleDocEntry[]> {
  const entries = await fs.readdir(modulesDirectory, {
    withFileTypes: true,
    recursive: true,
  });

  const results: ModuleDocEntry[] = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".ts") || entry.name.startsWith("Native"))
      continue;

    const filePath = path.join(entry.parentPath, entry.name);
    const doc = analyzeModuleFile(filePath, packageRoot);
    if (doc) {
      results.push(doc);
      console.log(
        `Analyzed module ${doc.name} (${doc.methods.length} methods)`,
      );
    }
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}
