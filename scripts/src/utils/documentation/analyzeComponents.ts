import { promises as fs } from "node:fs";
import * as path from "node:path";
import ts from "typescript";

import {
  collectColocatedTypes,
  extractMethodsFromMembers,
  getLeadingJsDoc,
  getTypeText,
} from "./analyzerUtils";
import { parseTsDoc } from "./parseTsDoc";
import type {
  ComponentDocEntry,
  ExampleEntry,
  MethodDocEntry,
  PropDocEntry,
  TypeDocEntry,
} from "../../types/DocEntry";

const IGNORE_COMPONENTS = new Set([
  "UserLocationPuck",
  "UserLocationPuckHeading",
]);
const FILE_PATTERN = /\.(tsx|(?<!d\.)ts)$/;

function collectInterfaceMembers(
  decl: ts.InterfaceDeclaration,
  sourceFile: ts.SourceFile,
): PropDocEntry[] {
  const props: PropDocEntry[] = [];
  for (const member of decl.members) {
    if (!ts.isPropertySignature(member)) continue;
    const name = member.name.getText(sourceFile);
    if (!name || name.startsWith("_")) continue;

    const rawComment = getLeadingJsDoc(sourceFile, member);
    const parsed = rawComment ? parseTsDoc(rawComment) : undefined;

    props.push({
      name,
      required: !member.questionToken,
      type: getTypeText(member.type, sourceFile),
      defaultValue: parsed?.defaultValue,
      description: parsed?.description ?? "",
      see: parsed?.see ?? [],
    });
  }
  return props;
}

function collectTypeLiteralMembers(
  typeLiteral: ts.TypeLiteralNode,
  sourceFile: ts.SourceFile,
): PropDocEntry[] {
  const props: PropDocEntry[] = [];
  for (const member of typeLiteral.members) {
    if (!ts.isPropertySignature(member)) continue;
    const name = member.name.getText(sourceFile);
    if (!name || name.startsWith("_")) continue;

    const rawComment = getLeadingJsDoc(sourceFile, member);
    const parsed = rawComment ? parseTsDoc(rawComment) : undefined;

    props.push({
      name,
      required: !member.questionToken,
      type: getTypeText(member.type, sourceFile),
      defaultValue: parsed?.defaultValue,
      description: parsed?.description ?? "",
      see: parsed?.see ?? [],
    });
  }
  return props;
}
function collectPropsFromTypeAlias(
  decl: ts.TypeAliasDeclaration,
  sourceFile: ts.SourceFile,
): { props: PropDocEntry[]; composes: string[] } {
  const props: PropDocEntry[] = [];
  const composes: string[] = [];

  function visitType(typeNode: ts.TypeNode) {
    if (ts.isTypeLiteralNode(typeNode)) {
      props.push(...collectTypeLiteralMembers(typeNode, sourceFile));
    } else if (ts.isIntersectionTypeNode(typeNode)) {
      for (const constituent of typeNode.types) {
        if (ts.isTypeLiteralNode(constituent)) {
          props.push(...collectTypeLiteralMembers(constituent, sourceFile));
        } else if (ts.isTypeReferenceNode(constituent)) {
          const fullType = constituent.getText(sourceFile);
          if (fullType && !composes.includes(fullType)) {
            composes.push(fullType);
          }
        }
      }
    }
  }

  visitType(decl.type);
  return { props, composes };
}

function analyzeFile(
  filePath: string,
  packageRoot: string,
): ComponentDocEntry | undefined {
  const sourceText = require("fs").readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  let propsInterface: ts.InterfaceDeclaration | undefined;
  let propsTypeAlias: ts.TypeAliasDeclaration | undefined;
  let refInterface: ts.InterfaceDeclaration | undefined;
  let componentNode: ts.Node | undefined;
  let componentName: string | undefined;

  for (const statement of sourceFile.statements) {
    const isExported =
      (ts.canHaveModifiers(statement)
        ? ts.getModifiers(statement)
        : undefined
      )?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;

    if (!isExported) continue;

    if (ts.isInterfaceDeclaration(statement)) {
      const name = statement.name.text;
      if (name.endsWith("Props")) {
        propsInterface = statement;
        componentName = name.slice(0, -"Props".length);
      } else if (name.endsWith("Ref")) {
        refInterface = statement;
      }
    } else if (ts.isTypeAliasDeclaration(statement)) {
      const name = statement.name.text;
      if (name.endsWith("Props")) {
        propsTypeAlias = statement;
        componentName = name.slice(0, -"Props".length);
      }
    } else if (ts.isVariableStatement(statement)) {
      const decl = statement.declarationList.declarations[0];
      if (decl && ts.isIdentifier(decl.name)) {
        const name = decl.name.text;
        if (
          name[0] === name[0]?.toUpperCase() &&
          name[0] !== name[0]?.toLowerCase()
        ) {
          componentNode = statement;
        }
      }
    } else if (ts.isFunctionDeclaration(statement) && statement.name) {
      const name = statement.name.text;
      if (
        name[0] === name[0]?.toUpperCase() &&
        name[0] !== name[0]?.toLowerCase()
      ) {
        componentNode = statement;
      }
    }
  }

  if (!componentName || IGNORE_COMPONENTS.has(componentName)) return undefined;
  if (!propsInterface && !propsTypeAlias) return undefined;

  // Description and examples from component node or Props comment
  let description = "";
  let examples: ExampleEntry[] = [];
  const descNode =
    componentNode ?? (propsInterface as ts.Node | undefined) ?? propsTypeAlias;
  if (descNode) {
    const raw = getLeadingJsDoc(sourceFile, descNode);
    if (raw) {
      const parsed = parseTsDoc(raw);
      description = parsed.description;
      examples = parsed.examples;
    }
  }

  // Props
  let props: PropDocEntry[] = [];
  let composes: string[] = [];

  if (propsInterface) {
    props = collectInterfaceMembers(propsInterface, sourceFile);
    // Heritage clauses
    if (propsInterface.heritageClauses) {
      for (const clause of propsInterface.heritageClauses) {
        for (const type of clause.types) {
          const fullType = type.getText(sourceFile);
          if (fullType && !composes.includes(fullType)) {
            composes.push(fullType);
          }
        }
      }
    }
  } else if (propsTypeAlias) {
    const result = collectPropsFromTypeAlias(propsTypeAlias, sourceFile);
    props = result.props;
    composes = result.composes;
  }

  // Methods from Ref interface
  const methods: MethodDocEntry[] = refInterface
    ? extractMethodsFromMembers(refInterface.members, sourceFile)
    : [];

  // Co-located exported types (skip Props and Ref — already rendered elsewhere)
  const skipTypeNames = new Set<string>([
    `${componentName}Props`,
    `${componentName}Ref`,
  ]);
  const types: TypeDocEntry[] = collectColocatedTypes(
    sourceFile,
    filePath,
    packageRoot,
    skipTypeNames,
  );

  return {
    name: componentName,
    filePath: path.relative(packageRoot, filePath),
    description,
    examples,
    props,
    methods,
    composes,
    types,
  };
}

export async function analyzeComponents(
  componentDirectory: string,
  packageRoot: string,
): Promise<ComponentDocEntry[]> {
  const entries = await fs.readdir(componentDirectory, {
    withFileTypes: true,
    recursive: true,
  });

  const results: ComponentDocEntry[] = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!FILE_PATTERN.test(entry.name)) continue;
    if (entry.name.startsWith("Native")) continue;
    if (entry.name.includes("NativeComponent")) continue;

    const baseName = path.parse(entry.name).name;
    if (IGNORE_COMPONENTS.has(baseName)) continue;

    const filePath = path.join(entry.parentPath, entry.name);
    const doc = analyzeFile(filePath, packageRoot);
    if (doc) {
      results.push(doc);
      console.log(
        `Analyzed component ${doc.name} (${doc.props.length} props, ${doc.methods.length} methods)`,
      );
    }
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}
