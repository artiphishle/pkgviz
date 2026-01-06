/**
 * Extracts the package/unit name from a Delphi uses clause import.
 *
 * Delphi imports are in the format:
 * - uses UnitName;
 * - uses UnitName in 'path/to/UnitName.pas';
 * - uses Vcl.Forms, System.SysUtils;
 *
 * @param importStatement - The full import statement (e.g., "System.SysUtils")
 * @returns The package/namespace name
 */
export function extractPackageFromImport(importStatement: string): string {
  const trimmed = importStatement.trim();

  // Handle dotted notation (e.g., "System.SysUtils" -> "System")
  const parts = trimmed.split('.');
  if (parts.length > 1) return parts[0];

  // For single unit names without namespace, return as-is
  return trimmed;
}
