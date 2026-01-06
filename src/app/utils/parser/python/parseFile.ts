'use server';
import type { ParsedFile, MethodCall, MethodDefinition, ImportDefinition } from '@/shared/types';

import fs from 'node:fs';
import path from 'node:path';
import { extractPythonPackageFromImport } from '@/app/utils/parser/python/extractPythonPackageFromImport';

/**
 * Extracts module path from Python __init__.py structure.
 */
function extractModulePath(filePath: string, projectRoot: string): string {
  const relativePath = path.relative(projectRoot, filePath);
  const parts = relativePath.split(path.sep);

  // Remove the filename
  parts.pop();

  // Join with dots for Python module notation
  return parts.join('.');
}

/**
 * Extracts import statements from Python code.
 */
function extractImports(content: string): ImportDefinition[] {
  const imports: ImportDefinition[] = [];

  // Match: import module
  // Match: import module as alias
  // Match: from module import something
  const importRegex =
    /(?:^|\n)\s*(?:from\s+([\w.]+)\s+)?import\s+([\w\s,*]+?)(?:\s+as\s+\w+)?(?:\s|$|#)/gm;

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const fromModule = match[1];
    const importedItems = match[2];

    if (fromModule) {
      // from X import Y
      const pkg = extractPythonPackageFromImport(fromModule);
      const isIntrinsic = fromModule.startsWith('.');

      imports.push({
        name: fromModule,
        pkg,
        isIntrinsic,
      });
    } else {
      // import X, Y, Z
      const mods = importedItems.split(',').map(m => m.trim());
      for (const mod of mods) {
        const pkg = extractPythonPackageFromImport(mod);
        imports.push({
          name: mod,
          pkg,
          isIntrinsic: false,
        });
      }
    }
  }

  return imports;
}

/**
 * Extracts the class name from Python content.
 */
function extractClassName(content: string, fileName: string): string {
  // Try to find class declaration
  const classMatch = content.match(/^class\s+([A-Za-z0-9_]+)/m);
  if (classMatch) {
    return classMatch[1];
  }

  // Fallback to filename without extension
  return path.basename(fileName, path.extname(fileName));
}

/**
 * Extracts method/function definitions from Python content.
 */
function extractMethodDefinitions(content: string): MethodDefinition[] {
  const methods: MethodDefinition[] = [];

  // Match function definitions: def method_name(params): or async def method_name(params):
  const methodRegex =
    /(?:^|\n)\s*(async\s+)?def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*$$([^)]*)$$\s*(?:->([^:]+))?:/gm;

  let match;
  while ((match = methodRegex.exec(content)) !== null) {
    const name = match[2];
    const paramsStr = match[3];
    const returnType = match[4]?.trim() || 'None';

    // Parse parameters
    const params = paramsStr
      .split(',')
      .map(p => p.trim())
      .filter(p => p && p !== 'self' && p !== 'cls');

    // Determine visibility (Python convention: _ prefix = protected, __ prefix = private)
    let visibility: 'public' | 'protected' | 'private' | 'default' = 'public';
    if (name.startsWith('__') && !name.endsWith('__')) {
      visibility = 'private';
    } else if (name.startsWith('_')) {
      visibility = 'protected';
    }

    methods.push({
      name,
      returnType,
      parameters: params,
      visibility,
    });
  }

  return methods;
}

/**
 * Extract method calls from Python content.
 */
function extractMethodCalls(content: string): MethodCall[] {
  const calls: MethodCall[] = [];

  // Match: object.method( or self.method(
  const callRegex = /([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;

  let match;
  while ((match = callRegex.exec(content)) !== null) {
    const callee = match[1];
    const method = match[2];

    // Skip common built-in methods to reduce noise
    if (
      ['append', 'extend', 'pop', 'remove', 'join', 'split', 'strip'].includes(method) &&
      ['str', 'list', 'dict', 'set'].includes(callee)
    ) {
      continue;
    }

    calls.push({ callee, method });
  }

  return calls;
}

/**
 * Parses a Python file and returns metadata useful for diagram generation.
 */
export async function parsePythonFile(fullPath: string, projectRoot: string): Promise<ParsedFile> {
  const content = fs.readFileSync(fullPath, 'utf-8');
  const fileName = path.basename(fullPath);

  const className = extractClassName(content, fileName);
  const modulePath = extractModulePath(fullPath, projectRoot);
  const imports = extractImports(content);
  const methods = extractMethodDefinitions(content);
  const calls = extractMethodCalls(content);
  const relativePath = path.relative(projectRoot, fullPath);

  return {
    className,
    package: modulePath,
    imports,
    methods,
    calls,
    path: relativePath,
  };
}
