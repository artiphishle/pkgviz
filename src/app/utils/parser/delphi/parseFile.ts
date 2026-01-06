'use server';
import type { ParsedFile, MethodCall, MethodDefinition, ImportDefinition } from '@/shared/types';

import fs from 'node:fs';
import path from 'node:path';
import { extractPackageFromImport } from '@/app/utils/parser/delphi/extractPackageFromImport';

/**
 * Extracts package/unit path from Delphi file structure.
 */
function extractUnitPath(filePath: string, projectRoot: string): string {
  const relativePath = path.relative(projectRoot, filePath);
  const dir = path.dirname(relativePath);

  // Convert path separators to dots for Delphi unit notation
  return dir === '.' ? '' : dir.replace(/[/\\]/g, '.');
}

/**
 * Extracts uses clause imports from Delphi code.
 */
function extractImports(content: string): ImportDefinition[] {
  const imports: ImportDefinition[] = [];

  // Match uses clause: uses Unit1, Unit2, Unit3;
  // Can appear in interface and implementation sections
  const usesRegex = /\buses\s+([\s\S]*?);/gi;

  let match;
  while ((match = usesRegex.exec(content)) !== null) {
    const usesClause = match[1];

    // Split by comma and extract unit names
    const units = usesClause.split(',').map(u => u.trim());

    for (const unit of units) {
      // Remove "in 'path'" suffix if present
      const unitName = unit.replace(/\s+in\s+['"].*?['"]/gi, '').trim();

      if (unitName) {
        const pkg = extractPackageFromImport(unitName);

        // Determine if it's a standard RTL/VCL/FMX unit
        const isIntrinsic =
          unitName.startsWith('System.') ||
          unitName.startsWith('Vcl.') ||
          unitName.startsWith('FMX.') ||
          unitName.startsWith('Data.') ||
          unitName.startsWith('Web.');

        imports.push({
          name: unitName,
          pkg,
          isIntrinsic,
        });
      }
    }
  }

  return imports;
}

/**
 * Extracts the unit/class name from Delphi content.
 */
function extractClassName(content: string, fileName: string): string {
  // Try to find unit name
  const unitMatch = content.match(/\bunit\s+([A-Za-z_][A-Za-z0-9_]*)\s*;/i);
  if (unitMatch) {
    return unitMatch[1];
  }

  // Try to find primary class name in type section
  const classMatch = content.match(/\bT([A-Za-z_][A-Za-z0-9_]*)\s*=\s*class/i);
  if (classMatch) {
    return 'T' + classMatch[1];
  }

  // Fallback to filename without extension
  return path.basename(fileName, path.extname(fileName));
}

/**
 * Extracts method/procedure/function definitions from Delphi content.
 */
function extractMethodDefinitions(content: string): MethodDefinition[] {
  const methods: MethodDefinition[] = [];

  // Match procedure/function declarations in interface or class definition
  // procedure MethodName(Params); or function MethodName: ReturnType;
  const methodRegex =
    /\b(procedure|function)\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?:$$(.*?)$$)?\s*(?::\s*([A-Za-z_][A-Za-z0-9_.<>]+))?\s*;/gi;

  let match;
  while ((match = methodRegex.exec(content)) !== null) {
    const kind = match[1].toLowerCase();
    const name = match[2];
    const paramsStr = match[3] || '';
    const returnType = match[4] || (kind === 'procedure' ? 'void' : 'Unknown');

    // Parse parameters (format: Name: Type; Name2: Type2)
    const params = paramsStr
      .split(';')
      .map(p => p.trim())
      .filter(p => p)
      .map(p => {
        // Extract parameter name (before colon)
        const colonIdx = p.indexOf(':');
        if (colonIdx > 0) {
          return p.substring(0, colonIdx).trim();
        }
        return p;
      });

    // Determine visibility based on section or keywords
    let visibility: 'public' | 'protected' | 'private' | 'default' = 'public';

    // Look backwards in content to find visibility section
    const beforeMethod = content.substring(0, match.index);
    if (/\bprivate\b(?!.*\bpublic\b)(?!.*\bprotected\b)/is.test(beforeMethod)) {
      visibility = 'private';
    } else if (/\bprotected\b(?!.*\bpublic\b)/is.test(beforeMethod)) {
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
 * Extract method calls from Delphi content.
 */
function extractMethodCalls(content: string): MethodCall[] {
  const calls: MethodCall[] = [];

  // Match: Object.Method( or Object.Property
  const callRegex = /([A-Za-z_][A-Za-z0-9_]*)\.([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;

  let match;
  while ((match = callRegex.exec(content)) !== null) {
    const callee = match[1];
    const method = match[2];

    calls.push({ callee, method });
  }

  return calls;
}

/**
 * Parses a Delphi file and returns metadata useful for diagram generation.
 */
export async function parseDelphiFile(fullPath: string, projectRoot: string): Promise<ParsedFile> {
  const content = fs.readFileSync(fullPath, 'utf-8');
  const fileName = path.basename(fullPath);

  const className = extractClassName(content, fileName);
  const unitPath = extractUnitPath(fullPath, projectRoot);
  const imports = extractImports(content);
  const methods = extractMethodDefinitions(content);
  const calls = extractMethodCalls(content);
  const relativePath = path.relative(projectRoot, fullPath);

  return {
    className,
    package: unitPath,
    imports,
    methods,
    calls,
    path: relativePath,
  };
}
