import * as path from "node:path";
import ts from "typescript";

import { parseTsDoc } from "./TsDocParser";
import type { ParsedTsDoc } from "./TsDocParser";
import type {
  MethodDocEntry,
  ParamDocEntry,
  TypeDocEntry,
} from "../types/DocEntry";

export function getLeadingJsDoc(
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

export function getParamName(param: ts.ParameterDeclaration): string {
  if (ts.isIdentifier(param.name)) return param.name.text;
  if (ts.isObjectBindingPattern(param.name)) return "{...}";
  return "[...]"; // ArrayBindingPattern
}

export function getTypeText(
  node: ts.TypeNode | undefined,
  sourceFile: ts.SourceFile,
): string {
  if (!node) return "unknown";
  return node.getText(sourceFile).trim();
}

export function buildParams(
  parameters: ts.NodeArray<ts.ParameterDeclaration>,
  methodName: string,
  sourceFile: ts.SourceFile,
  parsed: ParsedTsDoc | undefined,
): ParamDocEntry[] {
  const params: ParamDocEntry[] = [];
  for (const param of parameters) {
    const rawName = getParamName(param);
    // For destructured params, prefer the @param name from TSDoc over "{...}"
    const tsdocName =
      !ts.isIdentifier(param.name) && parsed?.params
        ? parsed.params.keys().next().value
        : undefined;
    if (!ts.isIdentifier(param.name) && !tsdocName) {
      throw new Error(
        `Method "${methodName}" in ${sourceFile.fileName} uses a destructured parameter but has no @param TSDoc tag to name it.`,
      );
    }
    const paramName = tsdocName ?? rawName;
    const paramDesc = parsed?.params.get(paramName) ?? "";
    params.push({
      name: paramName,
      type: getTypeText(param.type, sourceFile),
      description: paramDesc,
      optional: !!param.questionToken || !!param.initializer,
    });
  }
  return params;
}

/**
 * Extracts documented public methods from a list of class or interface members.
 * Handles both `MethodDeclaration` (classes) and `MethodSignature` (interfaces),
 * skipping private/protected class members.
 */
export function extractMethodsFromMembers(
  members: readonly (ts.ClassElement | ts.TypeElement)[],
  sourceFile: ts.SourceFile,
): MethodDocEntry[] {
  const methods: MethodDocEntry[] = [];

  for (const member of members) {
    if (!ts.isMethodDeclaration(member) && !ts.isMethodSignature(member))
      continue;
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

    const params = buildParams(member.parameters, name, sourceFile, parsed);
    const returnType = member.type
      ? getTypeText(member.type, sourceFile)
      : "void";

    methods.push({
      name,
      description: parsed?.description ?? "",
      params,
      returns:
        parsed?.returns || returnType !== "void"
          ? { type: returnType, description: parsed?.returns ?? "" }
          : undefined,
      examples: parsed?.examples ?? [],
    });
  }

  return methods;
}

/**
 * Collects exported type aliases and interfaces co-located in a source file,
 * excluding names in `skipNames` and any `Native*`-prefixed declarations. Only
 * types with a TSDoc description are included.
 */
export function collectColocatedTypes(
  sourceFile: ts.SourceFile,
  filePath: string,
  packageRoot: string,
  skipNames: Set<string>,
): TypeDocEntry[] {
  const types: TypeDocEntry[] = [];

  for (const statement of sourceFile.statements) {
    const isExported =
      (ts.canHaveModifiers(statement)
        ? ts.getModifiers(statement)
        : undefined
      )?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;

    if (!isExported) continue;

    let name: string | undefined;
    let typeText: string | undefined;

    if (ts.isInterfaceDeclaration(statement)) {
      name = statement.name.text;
      const members = statement.members
        .map((m) => `  ${m.getText(sourceFile).trim()}`)
        .join("\n");
      typeText = `interface ${name} {\n${members}\n}`;
    } else if (ts.isTypeAliasDeclaration(statement)) {
      name = statement.name.text;
      typeText = `type ${name} = ${statement.type.getText(sourceFile).trim()}`;
    }

    if (!name || !typeText) continue;
    if (skipNames.has(name)) continue;
    if (name.startsWith("Native")) continue;

    const rawComment = getLeadingJsDoc(sourceFile, statement);
    if (!rawComment) continue;

    const parsed = parseTsDoc(rawComment);
    if (!parsed.description) continue;

    types.push({
      name,
      filePath: path.relative(packageRoot, filePath),
      description: parsed.description,
      type: typeText,
    });
  }

  return types;
}
