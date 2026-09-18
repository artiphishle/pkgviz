'use server';
import path from 'node:path';

import { readTextFileWithinRoot } from '@ankhorage/utility/node/fs';
import { escapeRegExp } from '@ankhorage/utility/regex';

import { extractJavaPackageFromImport } from '@/app/utils/parser/java/extractJavaPackageFromImport';
import { getIntrinsicPackagesRecursive } from '@/app/utils/parser/java/getIntrinsicPackagesRecursive';
import type { MethodCall, MethodDefinition, ParsedFile } from '@/shared/types';
import { toPosix } from '@/shared/utils/toPosix';

/***
 * Extracts the package declaration from Java code.
 */
function extractPackageName(content: string): string {
  const match = /^package\s+([a-zA-Z0-9_.]+);/m.exec(content);
  return match?.[1] || '';
}

/***
 * Extracts import statements from Java code.
 */
function extractImports(content: string): string[] {
  return Array.from(content.matchAll(/^import\s+([a-zA-Z0-9_.*]+);/gm)).map(match => match[1]);
}

/***
 * Extracts the class name from the content and filename fallback.
 */
function extractClassName(content: string, fileName: string): string {
  const classPattern = new RegExp(
    `(?:public\\s+)?(class|interface|enum|record)\\s+${escapeRegExp(fileName)}\\b`
  );
  const classNameMatch = content.match(classPattern);
  if (classNameMatch) return fileName;

  const fallback = /(?:public\s+)?(class|interface|enum|record)\s+([A-Za-z0-9_]+)/.exec(content);
  return fallback?.[2] || '';
}

/***
 * Extracts the method definitions from file content
 */
function extractMethodDefinitions(content: string): MethodDefinition[] {
  const methodRegex =
    /(?:(public|protected|private)\s+)?(?:static\s+)?([\w<>[\]]+)\s+(\w+)\s*\(([^)]*)\)\s*\{/g;
  const methods: MethodDefinition[] = [];

  let match;
  while ((match = methodRegex.exec(content)) !== null) {
    const visibility = (match[1] as 'default' | 'public' | 'protected' | 'private') || 'default';
    const returnType = match[2];
    const name = match[3];
    const params = match[4]
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    methods.push({
      name,
      returnType,
      parameters: params,
      visibility,
    });
  }

  return methods;
}

/***
 * Extract method calls from file content
 */
function extractMethodCalls(content: string): MethodCall[] {
  const callRegex = /(\b\w+)\.(\w+)\s*\(/g;
  const calls: MethodCall[] = [];

  let match;
  while ((match = callRegex.exec(content)) !== null) {
    const callee = match[1];
    const method = match[2];
    calls.push({ callee, method });
  }

  return calls;
}

/***
 * Parses a Java file and returns metadata useful for diagram generation.
 */
export async function parseJavaFile(fullPath: string, projectRoot: string) {
  const { content, path: resolvedPath } = readTextFileWithinRoot({
    rootPath: projectRoot,
    filePath: fullPath,
  });
  const fileName = path.basename(resolvedPath, '.java');
  const intrinsicPackages = await getIntrinsicPackagesRecursive();

  const className = extractClassName(content, fileName);
  const pkg = extractPackageName(content);
  const imports = extractImports(content).map(imp => {
    const pkgFromImport = extractJavaPackageFromImport(imp);
    return {
      name: imp,
      pkg: pkgFromImport,
      isIntrinsic: intrinsicPackages.includes(pkgFromImport),
    };
  });
  const methods = extractMethodDefinitions(content);
  const calls = extractMethodCalls(content);
  const relativePath = toPosix(path.relative(projectRoot, resolvedPath));

  const file: ParsedFile = {
    className,
    package: pkg,
    imports,
    methods,
    calls,
    path: relativePath,
  };

  return file;
}
