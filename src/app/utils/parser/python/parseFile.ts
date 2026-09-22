'use server';
import path from 'node:path';

import { readTextFileWithinRoot } from '@ankhorage/utility/node/fs';

import type { ImportDefinition, ParsedFile } from '@/shared/types';
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
    path: toPosix(path.relative(projectRoot, resolvedPath)),
  };
}
