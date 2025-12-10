'use server';
import type { IDirectory } from '@/app/api/fs/types/index';

import { existsSync, readdirSync } from 'node:fs';
import { posix } from 'node:path';
import { detectLanguage } from '@/app/utils/detectLanguage';
import { ELanguage } from '@/app/utils/detectLanguage.types';
import { parseJavaFile } from '@/app/utils/parser/java/parseJavaFile';
import { parseFile as parseTypeScriptFile } from '@/app/utils/parser/typescript/parseFile';
import { parseProjectPath } from '@/contexts/parseEnv';

const JAVA_ROOT = 'src/main/java';

/**
 * Returns whether Java file structure is valid
 */
function isValidJavaFileStructure(dir: string) {
  const srcMainJavaDir = posix.resolve(dir, JAVA_ROOT);
  if (!existsSync(srcMainJavaDir)) throw new Error(`Missing dir: ${JAVA_ROOT}'`);

  return true;
}

/**
 * Returns resolved root
 */
export async function resolveRoot(dir: string, detectedLanguage: ELanguage) {
  switch (detectedLanguage) {
    case ELanguage.Java:
      if (!isValidJavaFileStructure(dir)) console.error('Failed to find:', JAVA_ROOT);
      return posix.resolve(dir, JAVA_ROOT);
    case ELanguage.TypeScript:
      return posix.resolve(dir);
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
  projectRoot = dir,
  language: ELanguage
) {
  // 1. Read current directory
  const entries = readdirSync(dir, { withFileTypes: true });
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

    const fullPath = posix.join(dir, entry.name);

    // Directory: Recursively continue to read
    if (entry.isDirectory())
      result[entry.name] = await readDirRecursively(fullPath, {}, '', language);

    // File: Parse file according to detected project language
    switch (language) {
      // Java
      case ELanguage.Java:
        if (entry.name.endsWith('.java'))
          result[entry.name] = await parseJavaFile(fullPath, projectRoot);
        break;

      // TypeScript
      case ELanguage.TypeScript:
        if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
          result[entry.name] = await parseTypeScriptFile(fullPath, parseProjectPath());
        }
        break;
    }
  }

  return result;
}

/**
 * Entrypoint
 */
export async function getParsedFileStructure(dir: string = parseProjectPath()) {
  // 1. Detect language & filter non-supported
  const detectedLanguage = (await detectLanguage(dir)).language;
  console.log('1. Detected language:', detectedLanguage);

  if (![ELanguage.Java, ELanguage.TypeScript].includes(detectedLanguage))
    throw new Error("Supported language is 'Java' & 'TypeScript'. More to follow.");

  // 2. Get validated root directory by detectedLanguage
  const rootDir = await resolveRoot(dir, detectedLanguage);
  console.log('2. rootDir:', rootDir);

  // 3. Read directory recursively
  return await readDirRecursively(rootDir, {}, '', detectedLanguage);
}
