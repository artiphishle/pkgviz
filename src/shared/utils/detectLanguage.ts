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

  // Determine the most likely language
  const counts = {
    [Language.JavaScript]: indicators[Language.JavaScript].length,
    [Language.TypeScript]: indicators[Language.TypeScript].length,
    [Language.Java]: indicators[Language.Java].length,
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
    /*** @todo Files ending in .java doesn't make a folder a project root */
    files.some(file => file.endsWith('.java')) ||
    files.includes('build.gradle') ||
    files.includes('build.gradle.kts')
  );
}
