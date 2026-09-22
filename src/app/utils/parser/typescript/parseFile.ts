import fs from 'node:fs/promises';
import { basename, relative } from 'node:path';

import type { ImportDefinition, ParsedFile } from '@/shared/types';
import { toPosix } from '@/shared/utils/toPosix';

/***
 * Extracts the class name from the content and filename fallback.
 */
function extractClassName(content: string, fileName: string): string {
  const classMatch = /class\s+(\w+)/.exec(content);
  if (classMatch) {
    return classMatch[1];
  }
  /*** @todo Don't return this fallback, search for functional wrapper instead */
  return basename(fileName, '.ts');
}

/***
 * Parses a TypeScript file and returns metadata for graph and tree projection.
 */
export async function parseFile(
  fullPath: string,
  projectRoot: string,
  imports: readonly ImportDefinition[]
): Promise<ParsedFile> {
  const posixFullPath = toPosix(fullPath);
  const content = await fs.readFile(posixFullPath, 'utf-8');
  const relativePath = toPosix(relative(projectRoot, posixFullPath));
  const segments = relativePath.split('/');
  const segmentedPath = segments.slice(0, -1);

  return {
    className: extractClassName(content, fullPath),
    imports: [...imports],
    package: segmentedPath.join('.'),
    path: relativePath,
  };
}
