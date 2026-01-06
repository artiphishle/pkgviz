/**
 * Extracts package name from Python import statement.
 *
 * Examples:
 *   "from flask import Flask" -> "flask"
 *   "import numpy as np" -> "numpy"
 *   "from utils.helpers import format_date" -> "utils"
 *   "from .models import User" -> "" (relative import, intrinsic)
 */
export function extractPythonPackageFromImport(importName: string): string {
  // Handle relative imports (. or ..)
  if (importName.startsWith('.')) return '';

  // Extract the base package (first part before any dots)
  const parts = importName.split('.');

  return parts[0] || importName;
}
