/**
 * Extract the package name from a Kotlin import statement.
 * Examples:
 * - "com.example.models.User" -> "com.example.models"
 * - "kotlinx.coroutines.launch" -> "kotlinx.coroutines"
 * - "java.util.Date" -> "java.util"
 */
export function extractPackageFromImport(importPath: string): string {
  // Remove any wildcard imports
  const cleanPath = importPath.replace(/\.\*$/, '');

  // Split by dots and remove the last part (class/function name)
  const parts = cleanPath.split('.');

  if (parts.length <= 1) return cleanPath;

  // Return all but the last part
  return parts.slice(0, -1).join('.');
}
