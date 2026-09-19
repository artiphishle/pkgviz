'use server';
import path from 'node:path';

import { readTextFileWithinRoot } from '@ankhorage/utility/node/fs';

import type { ImportDefinition, MethodCall, MethodDefinition, ParsedFile } from '@/shared/types';
import { toPosix } from '@/shared/utils/toPosix';

/*** Extracts package/unit path from Delphi file structure. */
function extractUnitPath(filePath: string, projectRoot: string): string {
  const relativePath = toPosix(path.relative(projectRoot, filePath));
  const dir = path.posix.dirname(relativePath);
  return dir === '.' ? '' : dir.replace(/\//g, '.');
}

/*** Extracts the unit/class name from Delphi content. */
function extractClassName(content: string, fileName: string): string {
  const unitMatch = /\bunit\s+([A-Za-z_][A-Za-z0-9_]*)\s*;/i.exec(content);
  if (unitMatch) return unitMatch[1];

  const classMatch = /\bT([A-Za-z_][A-Za-z0-9_]*)\s*=\s*class/i.exec(content);
  if (classMatch) return 'T' + classMatch[1];

  return path.basename(fileName, path.extname(fileName));
}

/*** Extracts method/procedure/function definitions from Delphi content. */
function extractMethodDefinitions(content: string): MethodDefinition[] {
  const methods: MethodDefinition[] = [];
  const methodRegex =
    /\b(procedure|function)\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?:$$(.*?)$$)?\s*(?::\s*([A-Za-z_][A-Za-z0-9_.<>]+))?\s*;/gi;

  let match;
  while ((match = methodRegex.exec(content)) !== null) {
    const kind = match[1].toLowerCase();
    const name = match[2];
    const paramsStr = match[3] || '';
    const returnType = match[4] || (kind === 'procedure' ? 'void' : 'Unknown');
    const params = paramsStr
      .split(';')
      .map(p => p.trim())
      .filter(p => p)
      .map(p => {
        const colonIdx = p.indexOf(':');
        return colonIdx > 0 ? p.substring(0, colonIdx).trim() : p;
      });

    let visibility: 'public' | 'protected' | 'private' | 'default' = 'public';
    const beforeMethod = content.substring(0, match.index);
    if (/\bprivate\b(?!.*\bpublic\b)(?!.*\bprotected\b)/is.test(beforeMethod)) {
      visibility = 'private';
    } else if (/\bprotected\b(?!.*\bpublic\b)/is.test(beforeMethod)) {
      visibility = 'protected';
    }

    methods.push({ name, returnType, parameters: params, visibility });
  }

  return methods;
}

/*** Extracts method calls from Delphi content. */
function extractMethodCalls(content: string): MethodCall[] {
  const calls: MethodCall[] = [];
  const callRegex = /([A-Za-z_][A-Za-z0-9_]*)\.([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
  let match;

  while ((match = callRegex.exec(content)) !== null) {
    calls.push({ callee: match[1], method: match[2] });
  }

  return calls;
}

/*** Parses Delphi metadata while consuming canonical dependency imports. */
export async function parseDelphiFile(
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
    package: extractUnitPath(resolvedPath, projectRoot),
    imports: [...imports],
    methods: extractMethodDefinitions(content),
    calls: extractMethodCalls(content),
    path: toPosix(path.relative(projectRoot, resolvedPath)),
  };
}
