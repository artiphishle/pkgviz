'use server';
import path from 'node:path';

import { readTextFileWithinRoot } from '@ankhorage/utility/node/fs';

import type { ImportDefinition, MethodCall, MethodDefinition, ParsedFile } from '@/shared/types';
import { toPosix } from '@/shared/utils/toPosix';

/*** Extracts module path from Python source structure. */
function extractModulePath(filePath: string, projectRoot: string): string {
  const relativePath = toPosix(path.relative(projectRoot, filePath));
  const parts = relativePath.split('/');
  parts.pop();
  return parts.join('.');
}

/*** Extracts the class name from Python content. */
function extractClassName(content: string, fileName: string): string {
  const classMatch = /^class\s+([A-Za-z0-9_]+)/m.exec(content);
  if (classMatch) return classMatch[1];
  return path.basename(fileName, path.extname(fileName));
}

/*** Extracts method/function definitions from Python content. */
function extractMethodDefinitions(content: string): MethodDefinition[] {
  const methods: MethodDefinition[] = [];
  const methodRegex =
    /(?:^|\n)\s*(async\s+)?def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*$$([^)]*)$$\s*(?:->([^:]+))?:/gm;

  let match;
  while ((match = methodRegex.exec(content)) !== null) {
    const name = match[2];
    const paramsStr = match[3];
    const returnType = match[4]?.trim() || 'None';
    const params = paramsStr
      .split(',')
      .map(p => p.trim())
      .filter(p => p && p !== 'self' && p !== 'cls');

    let visibility: 'public' | 'protected' | 'private' | 'default' = 'public';
    if (name.startsWith('__') && !name.endsWith('__')) {
      visibility = 'private';
    } else if (name.startsWith('_')) {
      visibility = 'protected';
    }

    methods.push({
      name,
      returnType,
      parameters: params,
      visibility,
    });
  }

  return methods;
}

/*** Extracts method calls from Python content. */
function extractMethodCalls(content: string): MethodCall[] {
  const calls: MethodCall[] = [];
  const callRegex = /([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;

  let match;
  while ((match = callRegex.exec(content)) !== null) {
    const callee = match[1];
    const method = match[2];

    if (
      ['append', 'extend', 'pop', 'remove', 'join', 'split', 'strip'].includes(method) &&
      ['str', 'list', 'dict', 'set'].includes(callee)
    ) {
      continue;
    }

    calls.push({ callee, method });
  }

  return calls;
}

/*** Parses Python metadata while consuming canonical dependency imports. */
export async function parsePythonFile(
  fullPath: string,
  projectRoot: string,
  imports: readonly ImportDefinition[]
): Promise<ParsedFile> {
  const { content, path: resolvedPath } = readTextFileWithinRoot({
    rootPath: projectRoot,
    filePath: fullPath,
  });
  const fileName = path.basename(resolvedPath);

  return {
    className: extractClassName(content, fileName),
    package: extractModulePath(resolvedPath, projectRoot),
    imports: [...imports],
    methods: extractMethodDefinitions(content),
    calls: extractMethodCalls(content),
    path: toPosix(path.relative(projectRoot, resolvedPath)),
  };
}
