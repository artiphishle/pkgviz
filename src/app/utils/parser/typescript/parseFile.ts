import type { ParsedFile, MethodCall, MethodDefinition, ImportDefinition } from '@/shared/types';

import fs from 'node:fs/promises';
import { basename, relative, resolve } from 'node:path';
import ts from 'typescript';
import { extractTypeScriptPackageFromImport } from '@/app/utils/parser/typescript/extractTypeScriptPackageFromImport';
import { toPosix } from '@/shared/utils/toPosix';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';

/**
 * Extracts import statements from TypeScript code.
 */
function extractImports(content: string, filename: string): ImportDefinition[] {
  const sourceFile = ts.createSourceFile('temp.ts', content, ts.ScriptTarget.Latest, true);
  const imports: ImportDefinition[] = [];

  sourceFile.forEachChild(node => {
    if (!ts.isImportDeclaration(node)) return;

    const fullPath = toPosix(filename).split('/').slice(0, -1).join('/');
    const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text;

    function resolveImportPath(curDir: string, specifier: string) {
      const root = parseProjectPath();

      if (specifier.startsWith('./') || specifier.startsWith('../'))
        return {
          isIntrinsic: true,
          resolvedPath: resolve(curDir, specifier).slice(root.length + 1),
        };

      if (specifier.startsWith('@/'))
        return {
          isIntrinsic: true,
          resolvedPath: specifier.replace(/^@/, 'src'),
        };

      return { isIntrinsic: false, resolvedPath: specifier };
    }

    const { resolvedPath, isIntrinsic } = resolveImportPath(fullPath, moduleSpecifier);

    const pkg = extractTypeScriptPackageFromImport(resolvedPath);
    imports.push({ name: pkg, pkg, isIntrinsic });
  });

  return imports;
}

/**
 * Extracts the class name from the content and filename fallback.
 */
function extractClassName(content: string, fileName: string): string {
  const classMatch = content.match(/class\s+(\w+)/);
  if (classMatch) {
    return classMatch[1];
  }
  /*** @todo Don't return this fallback, search for functional wrapper instead */
  return basename(fileName, '.ts');
}

/**
 * Extracts method definitions from TypeScript content.
 */
function extractMethodDefinitions(content: string): MethodDefinition[] {
  const sourceFile = ts.createSourceFile('temp.ts', content, ts.ScriptTarget.Latest, true);
  const methods: MethodDefinition[] = [];

  function visit(node: ts.Node) {
    if (ts.isMethodDeclaration(node) && node.name) {
      const name = node.name.getText();
      const returnType = node.type?.getText() ?? 'void';
      const parameters = node.parameters.map(p => p.getText());
      const modifiers = ts.getCombinedModifierFlags(node);
      let visibility: MethodDefinition['visibility'] = 'default';
      if (modifiers & ts.ModifierFlags.Private) visibility = 'private';
      else if (modifiers & ts.ModifierFlags.Protected) visibility = 'protected';
      else if (modifiers & ts.ModifierFlags.Public) visibility = 'public';

      methods.push({ name, returnType, parameters, visibility });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return methods;
}

/**
 * Extracts method calls from TypeScript content.
 */
function extractMethodCalls(content: string): MethodCall[] {
  const sourceFile = ts.createSourceFile('temp.ts', content, ts.ScriptTarget.Latest, true);
  const calls: MethodCall[] = [];

  function visit(node: ts.Node) {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
      const callee = node.expression.expression.getText();
      const method = node.expression.name.getText();
      calls.push({ callee, method });
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return calls;
}

/**
 * Parses a TypeScript file and returns metadata useful for diagram generation.
 */
export async function parseFile(fullPath: string, projectRoot: string): Promise<ParsedFile> {
  const posixFullPath = toPosix(fullPath);
  const content = await fs.readFile(posixFullPath, 'utf-8');
  const relativePath = toPosix(relative(projectRoot, posixFullPath));
  const segments = relativePath.split('/');
  const segmentedPath = segments.slice(0, -1);

  return {
    className: extractClassName(content, fullPath),
    imports: extractImports(content, fullPath),
    methods: extractMethodDefinitions(content),
    calls: extractMethodCalls(content),
    package: segmentedPath.join('.'),
    path: relativePath,
  };
}
