/**
 * Extracts the package/namespace from a C++ include statement
 * For example: "myapp/utils/Helper.h" -> "myapp.utils"
 */
export function extractCppPackageFromImport(importPath: string): string {
  // Remove file extension
  const withoutExt = importPath.replace(/\.(h|hpp|hxx)$/, '');

  // Split by path separator and take all but the last segment
  const segments = withoutExt.split('/');

  if (segments.length <= 1) {
    return '';
  }

  // Join with dots to create package-like structure
  return segments.slice(0, -1).join('.');
}
