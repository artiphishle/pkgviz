/***
 * Extracts the package from a reversed import array
 * @example ['B', 'A', 'java', 'com'] => 'com.java'
 */
export function extractJavaPackageFromReversedImportArray(segments: string[]): string {
  let collecting = false;
  const pkgSegments: string[] = [];

  for (const segment of segments) {
    if (!collecting && /^[A-Z]/.test(segment)) continue;
    collecting = true;
    pkgSegments.push(segment);
  }

  return pkgSegments.reverse().join('.');
}

/***
 * Extracts the package name from an import string
 * @example import 'some.package.*'   => 'some.package'
 * @example import 'some.package.A'   => 'some.package'
 * @example import 'some.package.A.B' => 'some.package'
 */
export function extractJavaPackageFromImport(imp: string) {
  // Remove trailing '.*' if present
  const cleaned = imp.replace(/\.\*$/, '');

  // Reverse '.' splitted segments to work more easily
  const segments = cleaned.split('.').reverse();

  // No package nesting means done
  if (segments.length < 2) return cleaned;

  // If last segment starts with lowerCase means done
  if (segments[0].toLowerCase() === segments[0]) return cleaned;

  // Strip class(es) and return pure package name
  return extractJavaPackageFromReversedImportArray(segments);
}
