/*** Resolves the nearest package ancestor contained in the supplied root set. */
export function findNearestPackageRoot(packageId: string, roots: ReadonlySet<string>): string {
  if (roots.has(packageId)) return packageId;
  const parts = packageId.split('.');
  const ancestors = Array.from({ length: Math.max(0, parts.length - 1) }, (_, index) =>
    parts.slice(0, parts.length - index - 1).join('.')
  );
  return ancestors.find(ancestor => roots.has(ancestor)) ?? packageId;
}
