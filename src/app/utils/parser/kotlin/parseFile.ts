'use server';
import path from 'node:path';

import { readTextFileWithinRoot } from '@ankhorage/utility/node/fs';

import type { ImportDefinition, ParsedFile } from '@/shared/types';
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

/*** Parses Kotlin file metadata while consuming canonical dependency imports. */
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
    path: toPosix(path.relative(projectRoot, resolvedPath)),
  };
}
