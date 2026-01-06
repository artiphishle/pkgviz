'use server';
import { Language, type LanguageDetectionResult } from '@/shared/types';

import fs from 'node:fs';
import path from 'node:path';

export async function detectLanguage(directoryPath: string): Promise<LanguageDetectionResult> {
  // Check if directory exists
  if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) {
    throw new Error(`Directory does not exist: ${directoryPath}`);
  }

  const files = fs.readdirSync(directoryPath);
  const indicators: Record<Language, string[]> = {
    [Language.JavaScript]: [],
    [Language.TypeScript]: [],
    [Language.Java]: [],
    [Language.Cpp]: [],
    [Language.Python]: [], // Added Python indicators
    [Language.Unknown]: [],
  };

  // Check for JavaScript indicators
  if (files.includes('package.json') && !files.includes('tsconfig.json')) {
    indicators[Language.JavaScript].push('package.json without tsconfig.json');
  }
  if (files.some(file => file.endsWith('.js') || file.endsWith('.jsx'))) {
    indicators[Language.JavaScript].push('.js/.jsx files');
  }
  if (files.includes('node_modules')) {
    indicators[Language.JavaScript].push('node_modules directory');
  }

  // Check for TypeScript indicators
  if (files.includes('tsconfig.json')) {
    indicators[Language.TypeScript].push('tsconfig.json');
  }
  if (files.some(file => file.endsWith('.ts') || file.endsWith('.tsx'))) {
    indicators[Language.TypeScript].push('.ts/.tsx files');
  }
  if (files.includes('package.json')) {
    try {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(directoryPath, 'package.json'), 'utf8')
      );
      if (packageJson.dependencies?.typescript || packageJson.devDependencies?.typescript) {
        indicators[Language.TypeScript].push('typescript dependency');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Check for Java indicators
  if (files.includes('pom.xml')) {
    indicators[Language.Java].push('pom.xml');
  }
  if (files.includes('build.gradle') || files.includes('build.gradle.kts')) {
    indicators[Language.Java].push('gradle build file');
  }
  if (files.some(file => file.endsWith('.java'))) {
    indicators[Language.Java].push('.java files');
  }
  if (files.includes('.mvn') || files.includes('mvnw') || files.includes('mvnw.cmd')) {
    indicators[Language.Java].push('Maven wrapper');
  }

  // Check for C++ indicators
  if (files.includes('CMakeLists.txt')) {
    indicators[Language.Cpp].push('CMakeLists.txt');
  }
  if (files.includes('Makefile')) {
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

  if (files.includes('requirements.txt')) {
    indicators[Language.Python].push('requirements.txt');
  }
  if (files.includes('setup.py') || files.includes('setup.cfg')) {
    indicators[Language.Python].push('setup.py/setup.cfg');
  }
  if (files.includes('pyproject.toml')) {
    indicators[Language.Python].push('pyproject.toml');
  }
  if (files.includes('Pipfile') || files.includes('Pipfile.lock')) {
    indicators[Language.Python].push('Pipfile');
  }
  if (files.includes('poetry.lock')) {
    indicators[Language.Python].push('poetry.lock');
  }
  if (files.some(file => file.endsWith('.py'))) {
    indicators[Language.Python].push('.py files');
  }
  if (files.includes('__pycache__') || files.some(file => file === '__init__.py')) {
    indicators[Language.Python].push('Python cache/module markers');
  }
  if (files.includes('venv') || files.includes('.venv') || files.includes('env')) {
    indicators[Language.Python].push('virtual environment');
  }

  // Determine the most likely language
  const counts = {
    [Language.JavaScript]: indicators[Language.JavaScript].length,
    [Language.TypeScript]: indicators[Language.TypeScript].length,
    [Language.Java]: indicators[Language.Java].length,
    [Language.Cpp]: indicators[Language.Cpp].length,
    [Language.Python]: indicators[Language.Python].length, // Added to counts
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
  const files = fs.readdirSync(directoryPath);
  return files.includes('package.json') && !files.includes('tsconfig.json');
}

export async function isTypeScriptRoot(directoryPath: string): Promise<boolean> {
  const files = fs.readdirSync(directoryPath);
  return files.includes('tsconfig.json') && files.includes('package.json');
}

export async function isJavaRoot(directoryPath: string): Promise<boolean> {
  const files = fs.readdirSync(directoryPath);
  return (
    files.includes('pom.xml') ||
    files.some(file => file.endsWith('.java')) ||
    files.includes('build.gradle') ||
    files.includes('build.gradle.kts')
  );
}

export async function isCppRoot(directoryPath: string): Promise<boolean> {
  const files = fs.readdirSync(directoryPath);
  return (
    files.includes('CMakeLists.txt') ||
    files.includes('Makefile') ||
    files.some(file => file.endsWith('.cpp') || file.endsWith('.cc') || file.endsWith('.cxx'))
  );
}

export async function isPythonRoot(directoryPath: string): Promise<boolean> {
  const files = fs.readdirSync(directoryPath);
  return (
    files.includes('requirements.txt') ||
    files.includes('setup.py') ||
    files.includes('pyproject.toml') ||
    files.some(file => file.endsWith('.py'))
  );
}
