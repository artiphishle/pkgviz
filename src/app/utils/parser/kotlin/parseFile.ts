'use server';
import path from 'node:path';

import { readTextFileWithinRoot } from '@ankhorage/utility/node/fs';

import type { ImportDefinition, MethodCall, MethodDefinition, ParsedFile } from '@/shared/types';
import { toPosix } from '@/shared/utils/toPosix';

/*** Extracts package declaration from Kotlin content. */
function extractPackage(content: string): string {
  const packageMatch = /^\s*package\s+([\w.]+)/m.exec(content);
  return packageMatch ? packageMatch[1] : '';
}

/*** Extracts class, object, data class, or sealed class name from Kotlin content. */
function extractClassName(content: string, fileName: string): string {
  const classMatch =
    /(?:^|\n)\s*(?:data\s+|sealed\s+|abstract\s+|open\s+)?(?:class|object|interface)\s+([A-Za-z0-9_]+)/m.exec(
      content
    );

  if (classMatch) return classMatch[1];
  return path.basename(fileName, path.extname(fileName));
}

/*** Extracts method/function definitions from Kotlin content. */
function extractMethodDefinitions(content: string): MethodDefinition[] {
  const methods: MethodDefinition[] = [];
  const methodRegex =
    /(?:^|\n)\s*(?:(private|protected|public|internal)\s+)?(?:suspend\s+)?fun\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*$$([^)]*)$$(?:\s*:\s*([^{=\n]+))?/gm;

  let match;
  while ((match = methodRegex.exec(content)) !== null) {
    const visibility = (match[1] || 'public') as
      'public' | 'protected' | 'private' | 'internal' | 'default';
    const name = match[2];
    const paramsStr = match[3];
    const returnType = match[4]?.trim() || 'Unit';
    const params = paramsStr
      .split(',')
      .map(p => p.trim())
      .filter(p => p)
      .map(p => {
        const paramMatch = /([a-zA-Z_][a-zA-Z0-9_]*)\s*:/.exec(p);
        return paramMatch ? paramMatch[1] : p;
      });

    methods.push({
      name,
      returnType,
      parameters: params,
      visibility: visibility === 'internal' ? 'default' : visibility,
    });
  }

  return methods;
}

/*** Extracts method calls from Kotlin content. */
function extractMethodCalls(content: string): MethodCall[] {
  const calls: MethodCall[] = [];
  const callRegex = /([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;

  let match;
  while ((match = callRegex.exec(content)) !== null) {
    const callee = match[1];
    const method = match[2];
    calls.push({ callee, method });
  }

  return calls;
}

/*** Parses Kotlin class/method/call metadata while consuming canonical dependency imports. */
export async function parseKotlinFile(
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
    package: extractPackage(content),
    imports: [...imports],
    methods: extractMethodDefinitions(content),
    calls: extractMethodCalls(content),
    path: toPosix(path.relative(projectRoot, resolvedPath)),
  };
}
