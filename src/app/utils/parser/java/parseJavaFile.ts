'use server';
import path from 'node:path';

import { readTextFileWithinRoot } from '@ankhorage/utility/node/fs';
import { escapeRegExp } from '@ankhorage/utility/regex';

import type { ImportDefinition, MethodCall, MethodDefinition, ParsedFile } from '@/shared/types';
import { toPosix } from '@/shared/utils/toPosix';

/***
 * Extracts the package declaration from Java code.
 */
function extractPackageName(content: string): string {
  const match = /^package\s+([a-zA-Z0-9_.]+);/m.exec(content);
  return match?.[1] || '';
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
 * Extract method calls from Java content.
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
 * Parses Java class/method/call metadata while consuming canonical dependency imports.
 */
export async function parseJavaFile(
  fullPath: string,
  projectRoot: string,
  imports: readonly ImportDefinition[]
): Promise<ParsedFile> {
  const { content, path: resolvedPath } = readTextFileWithinRoot({
    rootPath: projectRoot,
    filePath: fullPath,
  });
  const fileName = path.basename(resolvedPath, '.java');

  const file: ParsedFile = {
    className: extractClassName(content, fileName),
    package: extractPackageName(content),
    imports: [...imports],
    methods: extractMethodDefinitions(content),
    calls: extractMethodCalls(content),
    path: toPosix(path.relative(projectRoot, resolvedPath)),
  };

  return file;
}
