'use server';
import { readdirSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';
import { JAVA_ROOT } from '@/shared/constants';

export async function getIntrinsicPackagesRecursive(
  root: string = parseProjectPath(),
  currentPath?: string,
  results: string[] = []
) {
  const basePath = resolve(root, JAVA_ROOT);
  const dirPath = currentPath ?? basePath;

  const entries = readdirSync(dirPath, { withFileTypes: true });

  const subdirs = entries.filter(e => e.isDirectory());
  const javaFiles = entries.filter(e => e.isFile() && e.name.endsWith('.java'));

  // Only include if it has .java files and no subdirectories
  if (javaFiles.length > 0 && subdirs.length === 0) {
    const relPath = relative(basePath, dirPath).replace(/\//g, '.');
    results.push(relPath);
  }

  // Recurse into subdirectories
  for (const dir of subdirs) {
    const fullPath = resolve(dirPath, dir.name);
    await getIntrinsicPackagesRecursive(root, fullPath, results);
  }

  return results;
}
