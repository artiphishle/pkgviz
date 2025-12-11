'use server';
import { ELanguage, type ILanguageDetectionResult } from '@/app/utils/detectLanguage.types';

import fs from 'node:fs';
import path from 'node:path';


// Define a safe root directory (could be more specific in real code)
const SAFE_ROOT = process.cwd();

function sanitizeAndValidateDirectoryPath(userInputPath: string): string {
  // Avoid empty input
  if (!userInputPath) throw new Error("Empty directory path.");

  // Normalize and resolve the path
  let resolvedPath = path.resolve(SAFE_ROOT, userInputPath);

  // Optionally resolve symlinks. Wrap in try/catch for robustness.
  try {
    resolvedPath = fs.realpathSync(resolvedPath);
  } catch (e) {
    throw new Error(`Unable to resolve path: ${userInputPath}`);
  }

  if (!resolvedPath.startsWith(SAFE_ROOT)) {
    throw new Error("Attempt to access directory outside the safe root.");
  }

  return resolvedPath;
}

export async function detectLanguage(directoryPath: string): Promise<ILanguageDetectionResult> {
  // Validate and sanitize directoryPath
  const safeDirectoryPath = sanitizeAndValidateDirectoryPath(directoryPath);

  // Check if directory exists
  if (!fs.existsSync(safeDirectoryPath) || !fs.statSync(safeDirectoryPath).isDirectory()) {
    throw new Error(`Directory does not exist: ${safeDirectoryPath}`);
  }

  const files = fs.readdirSync(directoryPath);
  const indicators: Record<ELanguage, string[]> = {
    [ELanguage.JavaScript]: [],
    [ELanguage.TypeScript]: [],
    [ELanguage.Java]: [],
    [ELanguage.Unknown]: [],
  };

  // Check for JavaScript indicators
  if (files.includes('package.json') && !files.includes('tsconfig.json')) {
    indicators[ELanguage.JavaScript].push('package.json without tsconfig.json');
  }
  if (files.some(file => file.endsWith('.js') || file.endsWith('.jsx'))) {
    indicators[ELanguage.JavaScript].push('.js/.jsx files');
  }
  if (files.includes('node_modules')) {
    indicators[ELanguage.JavaScript].push('node_modules directory');
  }

  // Check for TypeScript indicators
  if (files.includes('tsconfig.json')) {
    indicators[ELanguage.TypeScript].push('tsconfig.json');
  }
  if (files.some(file => file.endsWith('.ts') || file.endsWith('.tsx'))) {
    indicators[ELanguage.TypeScript].push('.ts/.tsx files');
  }
  if (files.includes('package.json')) {
    try {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(directoryPath, 'package.json'), 'utf8')
      );
      if (packageJson.dependencies?.typescript || packageJson.devDependencies?.typescript) {
        indicators[ELanguage.TypeScript].push('typescript dependency');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Check for Java indicators
  if (files.includes('pom.xml')) {
    indicators[ELanguage.Java].push('pom.xml');
  }
  if (files.includes('build.gradle') || files.includes('build.gradle.kts')) {
    indicators[ELanguage.Java].push('gradle build file');
  }
  if (files.some(file => file.endsWith('.java'))) {
    indicators[ELanguage.Java].push('.java files');
  }
  if (files.includes('.mvn') || files.includes('mvnw') || files.includes('mvnw.cmd')) {
    indicators[ELanguage.Java].push('Maven wrapper');
  }

  // Determine the most likely language
  const counts = {
    [ELanguage.JavaScript]: indicators[ELanguage.JavaScript].length,
    [ELanguage.TypeScript]: indicators[ELanguage.TypeScript].length,
    [ELanguage.Java]: indicators[ELanguage.Java].length,
    [ELanguage.Unknown]: 0,
  };

  let detectedLanguage = ELanguage.Unknown;
  let maxCount = 0;

  for (const [language, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      detectedLanguage = language as ELanguage;
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
  const safeDirectoryPath = sanitizeAndValidateDirectoryPath(directoryPath);
  const files = fs.readdirSync(safeDirectoryPath);
  return files.includes('package.json') && !files.includes('tsconfig.json');
}

export async function isTypeScriptRoot(directoryPath: string): Promise<boolean> {
  const safeDirectoryPath = sanitizeAndValidateDirectoryPath(directoryPath);
  const files = fs.readdirSync(safeDirectoryPath);
  return files.includes('tsconfig.json') && files.includes('package.json');
}

export async function isJavaRoot(directoryPath: string): Promise<boolean> {
  const safeDirectoryPath = sanitizeAndValidateDirectoryPath(directoryPath);
  const files = fs.readdirSync(safeDirectoryPath);
  return (
    files.includes('pom.xml') ||
    /*** @todo Files ending in .java doesn't make a folder a project root */
    files.some(file => file.endsWith('.java')) ||
    files.includes('build.gradle') ||
    files.includes('build.gradle.kts')
  );
}
