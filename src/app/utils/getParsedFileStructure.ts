'use server';
import { Language, type ParsedDirectory } from '@/shared/types';

import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { toPosix } from '@/shared/utils/toPosix';
import { detectLanguage } from '@/shared/utils/detectLanguage';
import { parseJavaFile } from '@/app/utils/parser/java/parseJavaFile';
import { parseFile as parseTypeScriptFile } from '@/app/utils/parser/typescript/parseFile';
import { parseCppFile } from '@/app/utils/parser/cpp/parseCppFile';
import { parsePythonFile } from '@/app/utils/parser/python/parseFile';
import { parseDelphiFile } from '@/app/utils/parser/delphi/parseFile';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';
import { JAVA_ROOT } from '@/shared/constants';

/**
 * Returns resolved root
 */
export async function resolveRoot(dir: string, detectedLanguage: Language) {
  switch (detectedLanguage) {
    case Language.Java: {
      const javaRoot = toPosix(path.resolve(dir, JAVA_ROOT));
      if (!existsSync(javaRoot)) {
        console.error('Failed to find:', JAVA_ROOT);
        throw new Error(`Invalid Java project structure. Missing ${JAVA_ROOT}`);
      }
      return javaRoot;
    }

    case Language.TypeScript:
      // Normalize to an absolute project root
      return toPosix(path.resolve(dir));

    case Language.Cpp:
      // For C++, look for src directory or use project root
      const cppSrcRoot = toPosix(path.resolve(dir, 'src'));
      if (existsSync(cppSrcRoot)) {
        return cppSrcRoot;
      }
      return toPosix(path.resolve(dir));

    case Language.Python:
      // For Python, look for src directory or use project root
      const pythonSrcRoot = toPosix(path.resolve(dir, 'src'));
      if (existsSync(pythonSrcRoot)) {
        return pythonSrcRoot;
      }
      // Also check for common Python app structure
      const appRoot = toPosix(path.resolve(dir, 'app'));
      if (existsSync(appRoot)) {
        return appRoot;
      }
      return toPosix(path.resolve(dir));

    case Language.Delphi:
      // For Delphi, look for common source directories
      const delphiSrcRoot = toPosix(path.resolve(dir, 'src'));
      if (existsSync(delphiSrcRoot)) {
        return delphiSrcRoot;
      }
      // Also check for Source directory (common in Delphi projects)
      const sourceRoot = toPosix(path.resolve(dir, 'Source'));
      if (existsSync(sourceRoot)) {
        return sourceRoot;
      }
      return toPosix(path.resolve(dir));

    default:
      throw new Error(`Invalid file structure for ${detectedLanguage}`);
  }
}

/**
 * Read directory recursively
 */
export async function readDirRecursively(
  dir: string,
  result: ParsedDirectory = {},
  projectRoot: string,
  language: Language
): Promise<ParsedDirectory> {
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

  if (
    ![Language.Java, Language.TypeScript, Language.Cpp, Language.Python, Language.Delphi].includes(
      detectedLanguage
    )
  ) {
    throw new Error(
      "Supported language is 'Java', 'TypeScript', 'C++', 'Python' & 'Delphi'. More to follow."
    );
  }

  // 2. Get validated root directory by detectedLanguage
  const rootDir = await resolveRoot(projectPath, detectedLanguage);
  console.log('2. rootDir:', rootDir);

  // 3. Read directory recursively (pass resolved root as both dir and projectRoot)
  return await readDirRecursively(rootDir, {}, rootDir, detectedLanguage);
}
