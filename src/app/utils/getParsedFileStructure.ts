'use server';
import type { IDirectory } from '@/app/api/fs/types/index';

import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { detectLanguage } from '@/app/utils/detectLanguage';
import { ELanguage } from '@/app/utils/detectLanguage.types';
import { parseJavaFile } from '@/app/utils/parser/java/parseJavaFile';
import { parseFile as parseTypeScriptFile } from '@/app/utils/parser/typescript/parseFile';
import { parseProjectPath } from '@/contexts/parseEnv';

const JAVA_ROOT = 'src/main/java';

/**
 * Returns resolved root
 */
export async function resolveRoot(dir: string, detectedLanguage: ELanguage) {
  switch (detectedLanguage) {
    case ELanguage.Java: {
      const javaRoot = path.resolve(dir, JAVA_ROOT);
      if (!existsSync(javaRoot)) {
        console.error('Failed to find:', JAVA_ROOT);
        throw new Error(`Invalid Java project structure. Missing ${JAVA_ROOT}`);
      }
      return javaRoot;
    }

    case ELanguage.TypeScript:
      // Normalize to an absolute project root
      return path.resolve(dir);

    default:
      throw new Error(`Invalid file structure for ${detectedLanguage}`);
  }
}

/**
 * Read directory recursively
 */
export async function readDirRecursively(
  dir: string,
  result: IDirectory = {},
  projectRoot: string,
  language: ELanguage
): Promise<IDirectory> {
  const resolvedRoot = path.resolve(projectRoot);
  const resolvedDir = path.resolve(dir);

  // Validate dir is inside projectRoot (avoid path traversal / accidental escapes)
  const relative = path.relative(resolvedRoot, resolvedDir);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Path traversal detected: ${dir} is outside of project root ${projectRoot}`);
  }

  // 1. Read current directory
  const entries = readdirSync(resolvedDir, { withFileTypes: true });

  const ignores = [
    '@types',
    '.cache',
    '.git',
    '.github',
    '.meta',
    '.next',
    '.vscode',
    'coverage',
    'examples',
    'node_modules',
    'packages',
    'test',
  ];

  for (const entry of entries) {
    if (ignores.includes(entry.name)) continue;

    const fullPath = path.resolve(resolvedDir, entry.name);

    // Directory: Recursively continue to read
    if (entry.isDirectory()) {
      result[entry.name] = await readDirRecursively(fullPath, {}, projectRoot, language);
      continue;
    }

    // File: Parse file according to detected project language
    switch (language) {
      // Java
      case ELanguage.Java:
        if (entry.name.endsWith('.java')) {
          result[entry.name] = await parseJavaFile(fullPath, projectRoot);
        }
        break;

      // TypeScript
      case ELanguage.TypeScript:
        if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
          result[entry.name] = await parseTypeScriptFile(fullPath, projectRoot);
        }
        break;
    }
  }

  return result;
}

/**
 * Entrypoint
 */
export async function getParsedFileStructure() {
  const projectPath = parseProjectPath();

  // 1. Detect language & filter non-supported
  const detectedLanguage = (await detectLanguage(projectPath)).language;
  console.log('1. Detected language:', detectedLanguage);

  if (![ELanguage.Java, ELanguage.TypeScript].includes(detectedLanguage)) {
    throw new Error("Supported language is 'Java' & 'TypeScript'. More to follow.");
  }

  // 2. Get validated root directory by detectedLanguage
  const rootDir = await resolveRoot(projectPath, detectedLanguage);
  console.log('2. rootDir:', rootDir);

  // 3. Read directory recursively (pass resolved root as both dir and projectRoot)
  return await readDirRecursively(rootDir, {}, rootDir, detectedLanguage);
}
