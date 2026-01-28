'use server';
import { Language, type LanguageDetectionResult } from '@/shared/types';

import fs from 'node:fs';
import path from 'node:path';

function safeReadFileSync(baseDir: string, filePath: string): string {
  const resolvedBaseDir = path.resolve(baseDir);
  const resolvedFilePath = path.resolve(baseDir, filePath);

  if (!resolvedFilePath.startsWith(resolvedBaseDir + path.sep)) {
    throw new Error(`Path traversal attempt: ${filePath}`);
  }

  return fs.readFileSync(resolvedFilePath, 'utf8');
}

function safeResolveDir(baseDir: string, directoryPath: string): string {
  const resolvedBaseDir = path.resolve(baseDir);
  const resolvedDirectoryPath = path.resolve(baseDir, directoryPath);

  if (!resolvedDirectoryPath.startsWith(resolvedBaseDir + path.sep)) {
    throw new Error(`Path traversal attempt: ${directoryPath}`);
  }

  return resolvedDirectoryPath;
}

function safeReadDirSync(baseDir: string, dirPath: string): string[] {
  const resolvedBaseDir = path.resolve(baseDir);
  const resolvedDirPath = path.resolve(baseDir, dirPath);

  if (!resolvedDirPath.startsWith(resolvedBaseDir + path.sep)) {
    throw new Error(`Path traversal attempt: ${dirPath}`);
  }

  return fs.readdirSync(resolvedDirPath);
}

function findFilesRecursively(
  directoryPath: string,
  rootPath: string,
  depth: number = 3,
  currentDepth: number = 0
): string[] {
  if (currentDepth >= depth) {
    return [];
  }

  let filesAndDirs: string[] = [];
  const items = fs.readdirSync(directoryPath);

  for (const item of items) {
    const itemPath = path.join(directoryPath, item);

    // Ensure the path does not go outside the root directory
    if (!path.resolve(itemPath).startsWith(rootPath + path.sep)) {
      continue;
    }

    filesAndDirs.push(itemPath);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      filesAndDirs = filesAndDirs.concat(
        findFilesRecursively(itemPath, rootPath, depth, currentDepth + 1)
      );
    }
  }

  return filesAndDirs;
}

function isJavaScriptProject(files: string[], indicators: Record<Language, string[]>): void {
  // Check for JavaScript indicators
  if (
    files.some(file => path.basename(file) === 'package.json') &&
    !files.some(
      file => path.basename(file).startsWith('tsconfig') && path.basename(file).endsWith('.json')
    )
  ) {
    indicators[Language.JavaScript].push('package.json without tsconfig.json');
  }
  if (files.some(file => file.endsWith('.js') || file.endsWith('.jsx'))) {
    indicators[Language.JavaScript].push('.js/.jsx files');
  }
  if (files.some(file => path.basename(file) === 'node_modules')) {
    indicators[Language.JavaScript].push('node_modules directory');
  }
}

function isCppProject(files: string[], indicators: Record<Language, string[]>): void {
  // Check for C++ indicators
  if (files.some(file => path.basename(file) === 'CMakeLists.txt')) {
    indicators[Language.Cpp].push('CMakeLists.txt');
  }
  if (files.some(file => path.basename(file) === 'Makefile')) {
    indicators[Language.Cpp].push('Makefile');
  }
  if (files.some(file => file.endsWith('.cpp') || file.endsWith('.cc') || file.endsWith('.cxx'))) {
    indicators[Language.Cpp].push('.cpp/.cc/.cxx files');
  }
  if (files.some(file => file.endsWith('.h') || file.endsWith('.hpp') || file.endsWith('.hxx'))) {
    indicators[Language.Cpp].push('.h/.hpp/.hxx header files');
  }
  if (files.includes('conanfile.txt') || files.includes('conanfile.py')) {
    indicators[Language.Cpp].push('Conan package manager');
  }
  if (files.includes('vcpkg.json')) {
    indicators[Language.Cpp].push('vcpkg package manager');
  }
}

function isPythonProject(files: string[], indicators: Record<Language, string[]>): void {
  // Check for Python indicators
  if (files.some(file => path.basename(file) === 'requirements.txt')) {
    indicators[Language.Python].push('requirements.txt');
  }
  if (
    files.some(file => path.basename(file) === 'setup.py') ||
    files.some(file => path.basename(file) === 'setup.cfg')
  ) {
    indicators[Language.Python].push('setup.py/setup.cfg');
  }
  if (files.some(file => path.basename(file) === 'pyproject.toml')) {
    indicators[Language.Python].push('pyproject.toml');
  }
  if (
    files.some(file => path.basename(file) === 'Pipfile') ||
    files.some(file => path.basename(file) === 'Pipfile.lock')
  ) {
    indicators[Language.Python].push('Pipfile');
  }
  if (files.some(file => path.basename(file) === 'poetry.lock')) {
    indicators[Language.Python].push('poetry.lock');
  }
  if (files.some(file => file.endsWith('.py'))) {
    indicators[Language.Python].push('.py files');
  }
  if (
    files.some(file => path.basename(file) === '__pycache__') ||
    files.some(file => path.basename(file) === '__init__.py')
  ) {
    indicators[Language.Python].push('Python cache/module markers');
  }
  if (
    files.some(file => path.basename(file) === 'venv') ||
    files.some(file => path.basename(file) === '.venv') ||
    files.some(file => path.basename(file) === 'env')
  ) {
    indicators[Language.Python].push('virtual environment');
  }
}

function isDelphiProject(files: string[], indicators: Record<Language, string[]>): void {
  // Check for Delphi indicators
  if (files.some(file => file.endsWith('.dpr') || file.endsWith('.dproj'))) {
    indicators[Language.Delphi].push('.dpr/.dproj project files');
  }
  if (files.some(file => file.endsWith('.pas') || file.endsWith('.pp'))) {
    indicators[Language.Delphi].push('.pas/.pp unit files');
  }
  if (files.some(file => file.endsWith('.dfm') || file.endsWith('.fmx'))) {
    indicators[Language.Delphi].push('.dfm/.fmx form files');
  }
  if (files.some(file => file.endsWith('.dpk'))) {
    indicators[Language.Delphi].push('.dpk package files');
  }
  if (files.some(file => file.endsWith('.dcu') || file.endsWith('.dcu'))) {
    indicators[Language.Delphi].push('compiled unit files');
  }
  if (
    files.some(file => path.basename(file) === 'Win32') ||
    files.some(file => path.basename(file) === 'Win64')
  ) {
    indicators[Language.Delphi].push('Delphi platform directories');
  }
}

function isKotlinProject(
  files: string[],
  indicators: Record<Language, string[]>,
  directoryPath: string
): void {
  // Check for Kotlin indicators
  if (files.some(file => path.basename(file) === 'build.gradle.kts')) {
    indicators[Language.Kotlin].push('build.gradle.kts');
  }
  if (files.some(file => file.endsWith('.kt') || file.endsWith('.kts'))) {
    indicators[Language.Kotlin].push('.kt/.kts files');
  }
  const buildGradleFile = files.find(file => path.basename(file) === 'build.gradle');
  if (buildGradleFile) {
    try {
      const buildGradle = safeReadFileSync(directoryPath, buildGradleFile);
      if (buildGradle.includes('kotlin') || buildGradle.includes('org.jetbrains.kotlin')) {
        indicators[Language.Kotlin].push('Kotlin plugin in Gradle');
      }
    } catch (error) {
      console.error(error);
    }
  }
  const pomXmlFile = files.find(file => path.basename(file) === 'pom.xml');
  if (pomXmlFile) {
    try {
      const pomXml = safeReadFileSync(directoryPath, pomXmlFile);
      if (pomXml.includes('kotlin-maven-plugin') || pomXml.includes('kotlin-stdlib')) {
        indicators[Language.Kotlin].push('Kotlin plugin in Maven');
      }
    } catch (error) {
      console.error(error);
    }
  }
  if (files.some(file => path.basename(file) === 'settings.gradle.kts')) {
    indicators[Language.Kotlin].push('settings.gradle.kts');
  }
}

function isJavaProject(files: string[], indicators: Record<Language, string[]>): void {
  // Check for Java indicators
  if (files.some(file => path.basename(file) === 'pom.xml')) {
    indicators[Language.Java].push('pom.xml');
  }
  if (
    files.some(file => path.basename(file) === 'build.gradle') ||
    files.some(file => path.basename(file) === 'build.gradle.kts')
  ) {
    indicators[Language.Java].push('gradle build file');
  }
  if (files.some(file => file.endsWith('.java'))) {
    indicators[Language.Java].push('.java files');
  }
  if (
    files.some(file => path.basename(file) === '.mvn') ||
    files.some(file => path.basename(file) === 'mvnw') ||
    files.some(file => path.basename(file) === 'mvnw.cmd')
  ) {
    indicators[Language.Java].push('Maven wrapper');
  }
}

function isTypeScriptProject(
  files: string[],
  indicators: Record<Language, string[]>,
  directoryPath: string
): void {
  // Check for TypeScript indicators
  const tsconfigFile = files.find(
    file => path.basename(file).startsWith('tsconfig') && path.basename(file).endsWith('.json')
  );
  if (tsconfigFile) {
    indicators[Language.TypeScript].push(path.basename(tsconfigFile));
  }
  if (files.some(file => file.endsWith('.ts') || file.endsWith('.tsx'))) {
    indicators[Language.TypeScript].push('.ts/.tsx files');
  }
  const packageJsonFile = files.find(file => path.basename(file) === 'package.json');
  if (packageJsonFile) {
    try {
      const packageJson = JSON.parse(safeReadFileSync(directoryPath, packageJsonFile));
      if (packageJson.dependencies?.typescript || packageJson.devDependencies?.typescript) {
        indicators[Language.TypeScript].push('typescript dependency');
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export async function detectLanguage(directoryPath: string): Promise<LanguageDetectionResult> {
  // Check if directory exists
  const resolvedPath = path.resolve(directoryPath);
  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isDirectory()) {
    throw new Error(`Directory does not exist: ${directoryPath}`);
  }

  const files = findFilesRecursively(resolvedPath, resolvedPath).map(file =>
    path.relative(resolvedPath, file)
  );
  const indicators: Record<Language, string[]> = {
    [Language.JavaScript]: [],
    [Language.TypeScript]: [],
    [Language.Java]: [],
    [Language.Cpp]: [],
    [Language.Python]: [],
    [Language.Delphi]: [],
    [Language.Kotlin]: [],
    [Language.Unknown]: [],
  };

  isJavaScriptProject(files, indicators);

  isTypeScriptProject(files, indicators, resolvedPath);

  isJavaProject(files, indicators);

  isCppProject(files, indicators);
  isPythonProject(files, indicators);
  isDelphiProject(files, indicators);
  isKotlinProject(files, indicators, resolvedPath);

  // Determine the most likely language
  const counts = {
    [Language.JavaScript]: indicators[Language.JavaScript].length,
    [Language.TypeScript]: indicators[Language.TypeScript].length,
    [Language.Java]: indicators[Language.Java].length,
    [Language.Cpp]: indicators[Language.Cpp].length,
    [Language.Python]: indicators[Language.Python].length,
    [Language.Delphi]: indicators[Language.Delphi].length,
    [Language.Kotlin]: indicators[Language.Kotlin].length, // Added Kotlin to counts
    [Language.Unknown]: 0,
  };

  let detectedLanguage = Language.Unknown;
  let maxCount = 0;

  for (const [language, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      detectedLanguage = language as Language;
    }
  }

  // Calculate confidence (0-1)
  const totalIndicators = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const confidence = totalIndicators > 0 ? maxCount / totalIndicators : 0;

  return {
    language: detectedLanguage,
    confidence,
    indicators: indicators[detectedLanguage],
  };
}

export async function isJavaScriptRoot(directoryPath: string): Promise<boolean> {
  const resolvedPath = path.resolve(directoryPath);
  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isDirectory()) {
    return false;
  }
  const files = fs.readdirSync(resolvedPath);
  return files.includes('package.json') && !files.includes('tsconfig.json');
}

export async function isTypeScriptRoot(directoryPath: string): Promise<boolean> {
  const resolvedPath = path.resolve(directoryPath);
  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isDirectory()) {
    return false;
  }
  const files = fs.readdirSync(resolvedPath);
  return (
    files.some(file => file.startsWith('tsconfig') && file.endsWith('.json')) &&
    files.includes('package.json')
  );
}

export async function isJavaRoot(directoryPath: string): Promise<boolean> {
  const resolvedPath = path.resolve(directoryPath);
  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isDirectory()) {
    return false;
  }
  const files = fs.readdirSync(resolvedPath);
  return (
    files.includes('pom.xml') ||
    files.some(file => file.endsWith('.java')) ||
    files.includes('build.gradle') ||
    files.includes('build.gradle.kts')
  );
}

export async function isCppRoot(directoryPath: string): Promise<boolean> {
  const resolvedPath = safeResolveDir(process.cwd(), directoryPath);
  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isDirectory()) {
    return false;
  }
  const files = fs.readdirSync(resolvedPath);
  return (
    files.includes('CMakeLists.txt') ||
    files.includes('Makefile') ||
    files.some(file => file.endsWith('.cpp') || file.endsWith('.cc') || file.endsWith('.cxx'))
  );
}

export async function isPythonRoot(directoryPath: string): Promise<boolean> {
  const resolvedPath = safeResolveDir(process.cwd(), directoryPath);
  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isDirectory()) {
    return false;
  }
  const files = fs.readdirSync(resolvedPath);
  return (
    files.includes('requirements.txt') ||
    files.includes('setup.py') ||
    files.includes('pyproject.toml') ||
    files.some(file => file.endsWith('.py'))
  );
}

export async function isDelphiRoot(directoryPath: string): Promise<boolean> {
  const resolvedPath = safeResolveDir(process.cwd(), directoryPath);
  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isDirectory()) {
    return false;
  }
  const files = fs.readdirSync(resolvedPath);
  return (
    files.some(file => file.endsWith('.dpr') || file.endsWith('.dproj')) ||
    files.some(file => file.endsWith('.pas') || file.endsWith('.pp'))
  );
}

export async function isKotlinRoot(directoryPath: string): Promise<boolean> {
  const resolvedPath = safeResolveDir(process.cwd(), directoryPath);
  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isDirectory()) {
    return false;
  }
  const files = safeReadDirSync(resolvedPath, '.');
  return (
    files.includes('build.gradle.kts') ||
    files.some(file => file.endswith('.kt')) ||
    (files.includes('build.gradle') &&
      safeReadFileSync(resolvedPath, 'build.gradle').includes('kotlin'))
  );
}
