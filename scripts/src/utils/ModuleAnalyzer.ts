import { promises as fs } from "node:fs";
import * as path from "node:path";
import ts from "typescript";

import { parseTsDoc } from "./TsDocParser";
import type {
  MethodDocEntry,
  ModuleDocEntry,
  ParamDocEntry,
  TypeDocEntry,
} from "../types/DocEntry";

// ---------------------------------------------------------------------------
// Helpers (shared patterns with ComponentAnalyzer)
// ---------------------------------------------------------------------------

function getLeadingJsDoc(
  sourceFile: ts.SourceFile,
  node: ts.Node,
): string | undefined {
  const text = sourceFile.text;
  const ranges = ts.getLeadingCommentRanges(text, node.getFullStart());
  if (!ranges) return undefined;
  for (let i = ranges.length - 1; i >= 0; i--) {
    const r = ranges[i];
    if (!r) continue;
    if (r.kind === ts.SyntaxKind.MultiLineCommentTrivia) {
      const comment = text.slice(r.pos, r.end);
      if (comment.startsWith("/**")) return comment;
    }
  }
  return undefined;
}

function getParamName(param: ts.ParameterDeclaration): string {
  if (ts.isIdentifier(param.name)) return param.name.text;
  if (ts.isObjectBindingPattern(param.name)) return "{...}";
  return "[...]"; // ArrayBindingPattern
}

function getTypeText(
  node: ts.TypeNode | undefined,
  sourceFile: ts.SourceFile,
): string {
  if (!node) return "unknown";
  return node.getText(sourceFile).trim();
}

function extractMethods(
  members: ts.NodeArray<ts.ClassElement | ts.TypeElement>,
  sourceFile: ts.SourceFile,
): MethodDocEntry[] {
  const methods: MethodDocEntry[] = [];

  for (const member of members) {
    const isMethod =
      ts.isMethodDeclaration(member) || ts.isMethodSignature(member);
    if (!isMethod) continue;

    if (!ts.isIdentifier(member.name)) continue;
    const name = member.name.text;
    if (!name || name.startsWith("_")) continue;

    // For class methods, skip private/protected
    if (ts.isMethodDeclaration(member)) {
      const mods = ts.canHaveModifiers(member)
        ? ts.getModifiers(member)
        : undefined;
      const isPrivate = mods?.some(
        (m) =>
          m.kind === ts.SyntaxKind.PrivateKeyword ||
          m.kind === ts.SyntaxKind.ProtectedKeyword,
      );
      if (isPrivate) continue;
    }

    const rawComment = getLeadingJsDoc(sourceFile, member);
    const parsed = rawComment ? parseTsDoc(rawComment) : undefined;

    const params: ParamDocEntry[] = [];
    for (const param of member.parameters) {
      const paramName = getParamName(param);
      const paramDesc =
        parsed?.params.get(paramName) ??
        (ts.isIdentifier(param.name)
          ? ""
          : (parsed?.params.get("options") ?? ""));
      params.push({
        name: paramName,
        type: getTypeText(param.type, sourceFile),
        description: paramDesc,
        optional: !!param.questionToken || !!param.initializer,
      });
    }

    const returnType =
      ts.isMethodDeclaration(member) || ts.isMethodSignature(member)
        ? getTypeText(member.type, sourceFile)
        : "void";

    methods.push({
      name,
      description: parsed?.description ?? "",
      params,
      returns:
        parsed?.returns || (returnType && returnType !== "void")
          ? { type: returnType, description: parsed?.returns ?? "" }
          : undefined,
      examples: parsed?.examples ?? [],
    });
  }

  return methods;
}

// ---------------------------------------------------------------------------
// Module analysis (exported classes in src/modules/)
// ---------------------------------------------------------------------------

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

    const methods = extractMethods(statement.members, sourceFile);

    return {
      name,
      filePath: path.relative(packageRoot, filePath),
      description: parsed?.description ?? "",
      methods,
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

// ---------------------------------------------------------------------------
// Type analysis (exported types in src/types/)
// ---------------------------------------------------------------------------

const TYPES_CODEGEN_DIR = "codegen";
const TYPES_SKIP_NAMES = new Set(["BaseProps"]);

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
