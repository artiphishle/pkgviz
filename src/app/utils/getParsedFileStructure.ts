'use server';
import { existsSync } from 'node:fs';
import path from 'node:path';

import {
  readDirectoryWithinRoot,
  resolveFileSystemPathWithinRoot,
} from '@ankhorage/utility/node/fs';

import { parseCppFile } from '@/app/utils/parser/cpp/parseCppFile';
import { parseDelphiFile } from '@/app/utils/parser/delphi/parseFile';
import { parseJavaFile } from '@/app/utils/parser/java/parseJavaFile';
import { parseKotlinFile } from '@/app/utils/parser/kotlin/parseFile';
import { parsePythonFile } from '@/app/utils/parser/python/parseFile';
import { parseFile as parseTypeScriptFile } from '@/app/utils/parser/typescript/parseFile';
import { JAVA_ROOT } from '@/shared/constants';
import { Language, type ParsedDirectory } from '@/shared/types';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';
import { toPosix } from '@/shared/utils/toPosix';

import { inspectParserLanguageAsync } from './inspectParserLanguageAsync';

/***
 * Returns resolved root
 */
async function resolveRoot(dir: string, detectedLanguage: Language) {
  const projectRoot = resolveFileSystemPathWithinRoot(dir, '.', { allowRoot: true });

  switch (detectedLanguage) {
    case Language.Java: {
      const javaRoot = toPosix(resolveFileSystemPathWithinRoot(projectRoot, JAVA_ROOT));
      if (!existsSync(javaRoot)) {
        console.error('Failed to find:', JAVA_ROOT);
        throw new Error(`Invalid Java project structure. Missing ${JAVA_ROOT}`);
      }
      return javaRoot;
    }

    case Language.TypeScript:
      // Normalize to an absolute project root
      return toPosix(projectRoot);

    case Language.Cpp:
      // For C++, look for src directory or use project root
      const cppSrcRoot = toPosix(resolveFileSystemPathWithinRoot(projectRoot, 'src'));
      if (existsSync(cppSrcRoot)) {
        return cppSrcRoot;
      }
      return toPosix(projectRoot);

    case Language.Python:
      // For Python, look for src directory or use project root
      const pythonSrcRoot = toPosix(path.resolve(dir, 'src'));
      if (existsSync(pythonSrcRoot)) {
        return pythonSrcRoot;
      }
      // Also check for common Python app structure
      const appRoot = toPosix(resolveFileSystemPathWithinRoot(projectRoot, 'app'));
      if (existsSync(appRoot)) {
        return appRoot;
      }
      return toPosix(projectRoot);

    case Language.Delphi:
      // For Delphi, look for common source directories
      const delphiSrcRoot = toPosix(path.resolve(dir, 'src'));
      if (existsSync(delphiSrcRoot)) {
        return delphiSrcRoot;
      }
      // Also check for Source directory (common in Delphi projects)
      const sourceRoot = toPosix(resolveFileSystemPathWithinRoot(projectRoot, 'Source'));
      if (existsSync(sourceRoot)) {
        return sourceRoot;
      }
      return toPosix(projectRoot);

    case Language.Kotlin:
      // For Kotlin, look for src/main/kotlin directory (Gradle/Maven structure)
      const kotlinSrcRoot = toPosix(
        resolveFileSystemPathWithinRoot(projectRoot, 'src/main/kotlin')
      );
      if (existsSync(kotlinSrcRoot)) {
        return kotlinSrcRoot;
      }
      // Fallback to src directory
      const kotlinAltSrcRoot = toPosix(path.resolve(dir, 'src'));
      if (existsSync(kotlinAltSrcRoot)) {
        return kotlinAltSrcRoot;
      }
      return toPosix(projectRoot);

    default:
      throw new Error(`Invalid file structure for ${detectedLanguage}`);
  }
}

/***
 * Read directory recursively
 */
async function readDirRecursively(
  dir: string,
  result: ParsedDirectory = {},
  projectRoot: string,
  language: Language
): Promise<ParsedDirectory> {
  // 1. Read the current directory through the shared rooted-filesystem boundary.
  const { entries, path: resolvedDir } = readDirectoryWithinRoot({
    rootPath: projectRoot,
    directoryPath: dir,
  });

  const ignores = [
    '@types',
    '.cache',
    '.git',
    '.github',
    '.next',
    'dist',
    'coverage',
    'examples',
    'node_modules',
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
      case Language.Java:
        if (entry.name.endsWith('.java')) {
          result[entry.name] = await parseJavaFile(fullPath, projectRoot);
        }
        break;

      // TypeScript
      case Language.TypeScript:
        if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
          result[entry.name] = await parseTypeScriptFile(fullPath, projectRoot);
        }
        break;

      // C++
      case Language.Cpp:
        if (
          entry.name.endsWith('.cpp') ||
          entry.name.endsWith('.cc') ||
          entry.name.endsWith('.cxx') ||
          entry.name.endsWith('.h') ||
          entry.name.endsWith('.hpp') ||
          entry.name.endsWith('.hxx')
        ) {
          result[entry.name] = await parseCppFile(fullPath, projectRoot);
        }
        break;

      // Python
      case Language.Python:
        if (entry.name.endsWith('.py')) {
          result[entry.name] = await parsePythonFile(fullPath, projectRoot);
        }
        break;

      // Delphi
      case Language.Delphi:
        if (
          entry.name.endsWith('.pas') ||
          entry.name.endsWith('.pp') ||
          entry.name.endsWith('.dpr')
        ) {
          result[entry.name] = await parseDelphiFile(fullPath, projectRoot);
        }
        break;

      // Kotlin
      case Language.Kotlin:
        if (entry.name.endsWith('.kt') || entry.name.endsWith('.kts')) {
          result[entry.name] = await parseKotlinFile(fullPath, projectRoot);
        }
        break;
    }
  }

  return result;
}

/***
 * Entrypoint
 */
export async function getParsedFileStructure(language?: Language) {
  const projectPath = parseProjectPath();

  // 1. Detect language & filter non-supported
  const detectedLanguage = language ?? (await inspectParserLanguageAsync(projectPath)).language;
  console.log('1. Detected language:', detectedLanguage);

  if (
    ![
      Language.Java,
      Language.TypeScript,
      Language.Cpp,
      Language.Python,
      Language.Delphi,
      Language.Kotlin,
    ].includes(detectedLanguage)
  ) {
    throw new Error(
      "Supported language is 'Java', 'TypeScript', 'C++', 'Python', 'Delphi' & 'Kotlin'. More to follow."
    );
  }

  // 2. Get validated root directory by detectedLanguage
  const rootDir = await resolveRoot(projectPath, detectedLanguage);
  console.log('2. rootDir:', rootDir);

  // 3. Read directory recursively (pass resolved root as both dir and projectRoot)
  return await readDirRecursively(rootDir, {}, rootDir, detectedLanguage);
}
