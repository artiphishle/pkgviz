'use server';
import { parseProjectPath } from '@/contexts/parseEnv';
import { readdirSync } from 'node:fs';
import { posix } from 'node:path';

// Put to constants (also in other file)
const JAVA_ROOT = 'src/main/java';

export async function getIntrinsicPackagesRecursive(
  root: string = parseProjectPath(),
  currentPath?: string,
  results: string[] = []
) {
  const basePath = posix.resolve(root, JAVA_ROOT);
  const dirPath = currentPath ?? basePath;

  const entries = readdirSync(dirPath, { withFileTypes: true });

  const subdirs = entries.filter(e => e.isDirectory());
  const javaFiles = entries.filter(e => e.isFile() && e.name.endsWith('.java'));

  // Only include if it has .java files and no subdirectories
  if (javaFiles.length > 0 && subdirs.length === 0) {
    const relPath = posix.relative(basePath, dirPath).replace(/\//g, '.');
    results.push(relPath);
  }

  // Recurse into subdirectories
  for (const dir of subdirs) {
    const fullPath = posix.resolve(dirPath, dir.name);
    await getIntrinsicPackagesRecursive(root, fullPath, results);
  }

  return results;
}
