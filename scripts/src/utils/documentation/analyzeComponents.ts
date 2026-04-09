import { promises as fs } from "node:fs";
import * as path from "node:path";
import ts from "typescript";

import {
  collectColocatedTypes,
  extractMethodsFromMembers,
  getLeadingJsDoc,
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

function isInternalFile(filePath: string, packageRoot: string): boolean {
  const src = path.join(packageRoot, "src");
  return filePath.startsWith(src) && !filePath.includes("node_modules");
}

function typeHasExternalProperties(
  typeNode: ts.TypeNode,
  checker: ts.TypeChecker,
  packageRoot: string,
): boolean {
  try {
    const type = checker.getTypeAtLocation(typeNode);
    const props = checker.getPropertiesOfType(type);
    if (props.length === 0) return true;
    return props.some((sym) => {
      const decl = sym.declarations?.[0];
      if (!decl) return true;
      return !isInternalFile(decl.getSourceFile().fileName, packageRoot);
    });
  } catch {
    return true;
  }
}

function resolvePropsWithChecker(
  type: ts.Type,
  checker: ts.TypeChecker,
  packageRoot: string,
): PropDocEntry[] {
  const props: PropDocEntry[] = [];

  for (const symbol of checker.getPropertiesOfType(type)) {
    const name = symbol.getName();
    if (!name || name.startsWith("_")) continue;

    const declaration = symbol.declarations?.[0];
    if (!declaration) continue;
    if (!isInternalFile(declaration.getSourceFile().fileName, packageRoot)) {
      continue;
    }

    const isOptional = !!(symbol.flags & ts.SymbolFlags.Optional);

    const typeAnnotation =
      ts.isPropertySignature(declaration) ||
      ts.isPropertyDeclaration(declaration)
        ? declaration.type
        : undefined;
    const typeText = typeAnnotation
      ? typeAnnotation.getText(declaration.getSourceFile())
      : checker.typeToString(checker.getTypeOfSymbol(symbol));

    const rawComment = getLeadingJsDoc(
      declaration.getSourceFile(),
      declaration,
    );
    const parsed = rawComment ? parseTsDoc(rawComment) : undefined;

    props.push({
      name,
      required: !isOptional,
      type: typeText,
      defaultValue: parsed?.defaultValue,
      description: parsed?.description ?? "",
      see: parsed?.see ?? [],
    });
  }

  return props;
}

function analyzeFile(
  filePath: string,
  packageRoot: string,
  program: ts.Program,
  checker: ts.TypeChecker,
): ComponentDocEntry | undefined {
  const sourceFile = program.getSourceFile(filePath);
  if (!sourceFile) return undefined;

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

  const propsDecl = propsInterface ?? propsTypeAlias;
  if (!propsDecl) return undefined;

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

  const propsType = checker.getTypeAtLocation(propsDecl.name);
  const props = resolvePropsWithChecker(propsType, checker, packageRoot);

  const composes: string[] = [];

  if (propsInterface?.heritageClauses) {
    for (const clause of propsInterface.heritageClauses) {
      for (const typeExpr of clause.types) {
        if (typeHasExternalProperties(typeExpr, checker, packageRoot)) {
          const fullText = typeExpr.getText(sourceFile);
          if (fullText && !composes.includes(fullText)) {
            composes.push(fullText);
          }
        }
      }
    }
  } else if (propsTypeAlias) {
    const visitForComposes = (typeNode: ts.TypeNode): void => {
      if (ts.isIntersectionTypeNode(typeNode)) {
        for (const constituent of typeNode.types) {
          visitForComposes(constituent);
        }
      } else if (ts.isTypeReferenceNode(typeNode)) {
        if (typeHasExternalProperties(typeNode, checker, packageRoot)) {
          const fullText = typeNode.getText(sourceFile!);
          if (fullText && !composes.includes(fullText)) {
            composes.push(fullText);
          }
        }
      }
    };
    visitForComposes(propsTypeAlias.type);
  }

  const methods: MethodDocEntry[] = refInterface
    ? extractMethodsFromMembers(refInterface.members, sourceFile)
    : [];

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

  const filePaths: string[] = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!FILE_PATTERN.test(entry.name)) continue;
    if (entry.name.startsWith("Native")) continue;
    if (entry.name.includes("NativeComponent")) continue;

    const baseName = path.parse(entry.name).name;
    if (IGNORE_COMPONENTS.has(baseName)) continue;

    filePaths.push(path.join(entry.parentPath, entry.name));
  }

  const tsconfigPath = path.join(packageRoot, "tsconfig.json");
  const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    packageRoot,
  );
  const program = ts.createProgram(filePaths, {
    ...parsedConfig.options,
    noEmit: true,
  });
  const checker = program.getTypeChecker();

  const results: ComponentDocEntry[] = [];

  for (const filePath of filePaths) {
    const doc = analyzeFile(filePath, packageRoot, program, checker);
    if (doc) {
      results.push(doc);
      console.log(
        `Analyzed component ${doc.name} (${doc.props.length} props, ${doc.methods.length} methods)`,
      );
    }
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}
