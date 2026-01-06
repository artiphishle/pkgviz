'use server';
import type { ParsedFile, MethodCall, MethodDefinition, ImportDefinition } from '@/shared/types';

import fs from 'node:fs';
import path from 'node:path';
import { extractPackageFromImport } from '@/app/utils/parser/kotlin/extractPackageFromImport';

/**
 * Extracts package declaration from Kotlin content.
 */
function extractPackage(content: string): string {
  const packageMatch = content.match(/^\s*package\s+([\w.]+)/m);
  return packageMatch ? packageMatch[1] : '';
}

/**
 * Extracts import statements from Kotlin code.
 */
function extractImports(content: string): ImportDefinition[] {
  const imports: ImportDefinition[] = [];
  const importRegex = /^\s*import\s+([\w.]+(?:\.\*)?)/gm;

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    const pkg = extractPackageFromImport(importPath);

    // Check if it's an intrinsic/standard library import
    const isIntrinsic =
      importPath.startsWith('kotlin.') ||
      importPath.startsWith('java.') ||
      importPath.startsWith('javax.');

    imports.push({
      name: importPath,
      pkg,
      isIntrinsic,
    });
  }

  return imports;
}

/**
 * Extracts class, object, data class, or sealed class name from Kotlin content.
 */
function extractClassName(content: string, fileName: string): string {
  // Try to find class/object/interface declaration
  const classMatch = content.match(
    /(?:^|\n)\s*(?:data\s+|sealed\s+|abstract\s+|open\s+)?(?:class|object|interface)\s+([A-Za-z0-9_]+)/m
  );

  if (classMatch) {
    return classMatch[1];
  }

  // Fallback to filename without extension
  return path.basename(fileName, path.extname(fileName));
}

/**
 * Extracts method/function definitions from Kotlin content.
 */
function extractMethodDefinitions(content: string): MethodDefinition[] {
  const methods: MethodDefinition[] = [];

  // Match function definitions: fun methodName(params): ReturnType or suspend fun methodName
  const methodRegex =
    /(?:^|\n)\s*(?:(private|protected|public|internal)\s+)?(?:suspend\s+)?fun\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*$$([^)]*)$$(?:\s*:\s*([^{=\n]+))?/gm;

  let match;
  while ((match = methodRegex.exec(content)) !== null) {
    const visibility = (match[1] || 'public') as
      | 'public'
      | 'protected'
      | 'private'
      | 'internal'
      | 'default';
    const name = match[2];
    const paramsStr = match[3];
    const returnType = match[4]?.trim() || 'Unit';

    // Parse parameters
    const params = paramsStr
      .split(',')
      .map(p => p.trim())
      .filter(p => p)
      .map(p => {
        // Extract parameter name (before colon)
        const paramMatch = p.match(/([a-zA-Z_][a-zA-Z0-9_]*)\s*:/);
        return paramMatch ? paramMatch[1] : p;
      });

    methods.push({
      name,
      returnType,
      parameters: params,
      visibility: visibility === 'internal' ? 'default' : visibility,
    });
  }

  return methods;
}

/**
 * Extract method calls from Kotlin content.
 */
function extractMethodCalls(content: string): MethodCall[] {
  const calls: MethodCall[] = [];

  // Match: object.method( or variable.method(
  const callRegex = /([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;

  let match;
  while ((match = callRegex.exec(content)) !== null) {
    const callee = match[1];
    const method = match[2];

    calls.push({ callee, method });
  }

  return calls;
}

/**
 * Parses a Kotlin file and returns metadata useful for diagram generation.
 */
export async function parseKotlinFile(fullPath: string, projectRoot: string): Promise<ParsedFile> {
  const content = fs.readFileSync(fullPath, 'utf-8');
  const fileName = path.basename(fullPath);

  const packageName = extractPackage(content);
  const className = extractClassName(content, fileName);
  const imports = extractImports(content);
  const methods = extractMethodDefinitions(content);
  const calls = extractMethodCalls(content);
  const relativePath = path.relative(projectRoot, fullPath);

  return {
    className,
    package: packageName,
    imports,
    methods,
    calls,
    path: relativePath,
  };
}
