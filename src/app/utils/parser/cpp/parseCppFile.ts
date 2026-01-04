'use server';
import type { ParsedFile, MethodCall, MethodDefinition, ImportDefinition } from '@/shared/types';

import fs from 'node:fs';
import path from 'node:path';
import { extractCppPackageFromImport } from '@/app/utils/parser/cpp/extractCppPackageFromImport';

/**
 * Extracts namespace from C++ code.
 */
function extractNamespace(content: string): string {
  const match = content.match(/namespace\s+([a-zA-Z0-9_:]+)\s*\{/);
  return match?.[1]?.replace(/::/g, '.') || '';
}

/**
 * Extracts include statements from C++ code.
 */
function extractIncludes(content: string, projectRoot: string): ImportDefinition[] {
  console.log('[CPP] projectRoot:', projectRoot);
  const includeRegex = /#include\s+["<]([^">]+)[">]/g;
  const includes: ImportDefinition[] = [];

  let match;
  while ((match = includeRegex.exec(content)) !== null) {
    const includePath = match[1];

    // System includes use angle brackets, local includes use quotes
    const isSystemInclude = content.includes(`<${includePath}>`);
    const pkg = extractCppPackageFromImport(includePath);

    includes.push({
      name: includePath,
      pkg,
      isIntrinsic: !isSystemInclude, // Local includes are intrinsic
    });
  }

  return includes;
}

/**
 * Extracts the class name from the content and filename fallback.
 */
function extractClassName(content: string, fileName: string): string {
  // Try to find class declaration
  const classMatch = content.match(/class\s+([A-Za-z0-9_]+)/);
  if (classMatch) {
    return classMatch[1];
  }

  // Try to find struct declaration
  const structMatch = content.match(/struct\s+([A-Za-z0-9_]+)/);
  if (structMatch) {
    return structMatch[1];
  }

  // Fallback to filename without extension
  return path.basename(fileName, path.extname(fileName));
}

/**
 * Extracts method definitions from C++ content.
 */
function extractMethodDefinitions(content: string): MethodDefinition[] {
  const methods: MethodDefinition[] = [];

  // Match method definitions (simplified regex, may need refinement)
  const methodRegex = /(?:(public|protected|private):\s*)?([\w<>:&*\s]+)\s+(\w+)\s*$$([^)]*)$$/g;

  let match;
  let currentVisibility: 'public' | 'protected' | 'private' | 'default' = 'default';

  // Also track visibility changes
  const visibilityRegex = /(public|protected|private):/g;
  const lines = content.split('\n');

  for (const line of lines) {
    const visMatch = visibilityRegex.exec(line);
    if (visMatch) {
      currentVisibility = visMatch[1] as 'public' | 'protected' | 'private';
    }
  }

  methodRegex.lastIndex = 0;
  while ((match = methodRegex.exec(content)) !== null) {
    const visibility = (match[1] as 'public' | 'protected' | 'private') || currentVisibility;
    const returnType = match[2]?.trim() || 'void';
    const name = match[3];
    const params = match[4]
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    // Skip obvious non-methods (keywords, control structures)
    if (['if', 'while', 'for', 'switch', 'catch'].includes(name)) {
      continue;
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
 * Extract method calls from C++ content.
 */
function extractMethodCalls(content: string): MethodCall[] {
  const callRegex = /(\b\w+)(?:\.|->)(\w+)\s*\(/g;
  const calls: MethodCall[] = [];

  let match;
  while ((match = callRegex.exec(content)) !== null) {
    const callee = match[1];
    const method = match[2];
    calls.push({ callee, method });
  }

  return calls;
}

/**
 * Parses a C++ file and returns metadata useful for diagram generation.
 */
export async function parseCppFile(fullPath: string, projectRoot: string): Promise<ParsedFile> {
  const content = fs.readFileSync(fullPath, 'utf-8');
  const fileName = path.basename(fullPath);

  const className = extractClassName(content, fileName);
  const namespace = extractNamespace(content);
  const includes = extractIncludes(content, projectRoot);
  const methods = extractMethodDefinitions(content);
  const calls = extractMethodCalls(content);
  const relativePath = path.relative(projectRoot, fullPath);

  return {
    className,
    package: namespace,
    imports: includes,
    methods,
    calls,
    path: relativePath,
  };
}
