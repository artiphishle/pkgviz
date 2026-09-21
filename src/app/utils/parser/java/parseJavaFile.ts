'use server';
import path from 'node:path';

import { readTextFileWithinRoot } from '@ankhorage/utility/node/fs';
import { escapeRegExp } from '@ankhorage/utility/regex';

import type { ImportDefinition, ParsedFile } from '@/shared/types';
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
 * Parses Java file metadata while consuming canonical dependency imports.
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
    path: toPosix(path.relative(projectRoot, resolvedPath)),
  };

  return file;
}
