'use server';
import path from 'node:path';

import { readTextFileWithinRoot } from '@ankhorage/utility/node/fs';

import type { ImportDefinition, ParsedFile } from '@/shared/types';
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
    path: toPosix(path.relative(projectRoot, resolvedPath)),
  };
}
