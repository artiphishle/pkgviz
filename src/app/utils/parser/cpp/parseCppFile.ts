'use server';
import path from 'node:path';

import { readTextFileWithinRoot } from '@ankhorage/utility/node/fs';

import type { ImportDefinition, MethodCall, MethodDefinition, ParsedFile } from '@/shared/types';
import { toPosix } from '@/shared/utils/toPosix';

/*** Extracts namespace from C++ code. */
function extractNamespace(content: string): string {
  const match = /namespace\s+([a-zA-Z0-9_:]+)\s*\{/.exec(content);
  return match?.[1]?.replace(/::/g, '.') || '';
}

/*** Retains includes that intentionally have no graphable package target. */
function extractPresentationOnlyIncludes(content: string): ImportDefinition[] {
  const includeRegex = /#include\s+(["<])([^">]+)[">]/g;
  const imports: ImportDefinition[] = [];
  let match;

  while ((match = includeRegex.exec(content)) !== null) {
    const delimiter = match[1];
    const specifier = match[2];
    if (specifier.includes('/')) continue;
    imports.push({
      name: specifier,
      pkg: '',
      isIntrinsic: delimiter === '"',
    });
  }

  return imports;
}

/*** Restores complete include metadata in source declaration order. */
function mergeImports(
  content: string,
  canonicalImports: readonly ImportDefinition[]
): readonly ImportDefinition[] {
  return [...canonicalImports, ...extractPresentationOnlyIncludes(content)].sort(
    (left, right) => content.indexOf(left.name) - content.indexOf(right.name)
  );
}

/*** Extracts the class name from the content and filename fallback. */
function extractClassName(content: string, fileName: string): string {
  const classMatch = /class\s+([A-Za-z0-9_]+)/.exec(content);
  if (classMatch) return classMatch[1];

  const structMatch = /struct\s+([A-Za-z0-9_]+)/.exec(content);
  if (structMatch) return structMatch[1];

  return path.basename(fileName, path.extname(fileName));
}

/*** Extracts method definitions from C++ content. */
function extractMethodDefinitions(content: string): MethodDefinition[] {
  const methods: MethodDefinition[] = [];
  const methodRegex = /(?:(public|protected|private):\s*)?([\w<>:&*\s]+)\s+(\w+)\s*$$([^)]*)$$/g;
  let match;
  let currentVisibility: 'public' | 'protected' | 'private' | 'default' = 'default';

  const visibilityRegex = /(public|protected|private):/g;
  for (const line of content.split('\n')) {
    const visMatch = visibilityRegex.exec(line);
    if (visMatch) currentVisibility = visMatch[1] as 'public' | 'protected' | 'private';
  }

  methodRegex.lastIndex = 0;
  while ((match = methodRegex.exec(content)) !== null) {
    const visibility = (match[1] as 'public' | 'protected' | 'private') || currentVisibility;
    const returnType = match[2]?.trim() || 'void';
    const name = match[3];
    const params = match[4]
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    if (['if', 'while', 'for', 'switch', 'catch'].includes(name)) continue;
    methods.push({ name, returnType, parameters: params, visibility });
  }

  return methods;
}

/*** Extracts method calls from C++ content. */
function extractMethodCalls(content: string): MethodCall[] {
  const callRegex = /(\b\w+)(?:\.|->)(\w+)\s*\(/g;
  const calls: MethodCall[] = [];
  let match;

  while ((match = callRegex.exec(content)) !== null) {
    calls.push({ callee: match[1], method: match[2] });
  }
  return calls;
}

/*** Parses C++ metadata while consuming canonical dependency includes. */
export async function parseCppFile(
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
    package: extractNamespace(content),
    imports: [...mergeImports(content, imports)],
    methods: extractMethodDefinitions(content),
    calls: extractMethodCalls(content),
    path: toPosix(path.relative(projectRoot, resolvedPath)),
  };
}
