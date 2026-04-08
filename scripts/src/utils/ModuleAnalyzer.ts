import { promises as fs } from "node:fs";
import * as path from "node:path";
import ts from "typescript";

import { parseTsDoc } from "./TsDocParser";
import {
  collectColocatedTypes,
  extractMethodsFromMembers,
  getLeadingJsDoc,
} from "./analyzerUtils";
import type { ModuleDocEntry, TypeDocEntry } from "../types/DocEntry";

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

const TYPES_CODEGEN_DIR = "codegen";
const TYPES_SKIP_NAMES = new Set(["BaseProps", "MapLibreRNStyles"]);

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
      typeText = `{ ${statement.members.map((m) => m.getText(sourceFile)).join("; ")} }`;
    }

    if (!name || !typeText) continue;
    if (name !== baseName) continue;
    if (TYPES_SKIP_NAMES.has(name)) continue;

    const rawComment = getLeadingJsDoc(sourceFile, statement);
    if (!rawComment) continue; // Only include types with explicit TSDoc

    const parsed = parseTsDoc(rawComment);
    if (!parsed.description) continue; // Must have a description

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
    recursive: false, // Don't recurse into codegen/
  });

  const results: TypeDocEntry[] = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".ts")) continue;
    // Skip the codegen subdirectory
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
