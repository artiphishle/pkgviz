import type { IFile, MethodCall, MethodDefinition, ImportDefinition } from '@/app/api/fs/types';

import fs from 'node:fs/promises';
import path from 'node:path';
import * as ts from 'typescript';
import { extractTypeScriptPackageFromImport } from '@/app/utils/parser/typescript/extractTypeScriptPackageFromImport';

/**
 * Extracts import statements from TypeScript code.
 */
function extractImports(content: string): ImportDefinition[] {
  const sourceFile = ts.createSourceFile('temp.ts', content, ts.ScriptTarget.Latest, true);
  const imports: ImportDefinition[] = [];

  sourceFile.forEachChild(node => {
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text;
      const replacedAlias = moduleSpecifier.replace(/^\@/, 'src');

      imports.push({
        name: replacedAlias.split('/').join('.'),
        pkg: extractTypeScriptPackageFromImport(moduleSpecifier),
        isIntrinsic: moduleSpecifier.startsWith('@'),
      });
    }
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
  return path.basename(fileName, '.ts');
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
export async function parseFile(fullPath: string, projectRoot: string): Promise<IFile> {
  const content = await fs.readFile(fullPath, 'utf-8');
  const relativePath = path.relative(projectRoot, fullPath);
  const segments = relativePath.split('/');
  const segmentedPath = segments.slice(0, -1);

  return {
    className: extractClassName(content, fullPath),
    imports: extractImports(content),
    methods: extractMethodDefinitions(content),
    calls: extractMethodCalls(content),
    package: segmentedPath.join('.'),
    path: relativePath,
  };
}
