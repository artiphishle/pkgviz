/*** Finds minimal dotted package roots that have no ancestor in the same package set. */
export function findPackageRoots(packages: readonly string[]): readonly string[] {
  return [...packages].sort().reduce<string[]>((roots, packageId) => {
    return roots.some(parent => packageId.startsWith(parent + '.'))
      ? roots
      : [...roots, packageId];
  }, []);
}
