import type { PackageCycleDetail } from '@/types/audit';

/*** Derives the nearest package scope and depth that can display every selected cycle package. */
export function getCycleFocus(cycles: readonly PackageCycleDetail[]): CycleFocus | null {
  const packages = Array.from(new Set(cycles.flatMap(cycle => cycle.packages)));
  if (packages.length === 0) return null;

  const commonSegments = getCommonPackageSegments(packages);
  const commonPath = commonSegments.join('.');
  const scopeSegments = packages.includes(commonPath)
    ? commonSegments.slice(0, -1)
    : commonSegments;
  const packagePath = scopeSegments.join('.');
  const scopeDepth = scopeSegments.length;
  const subPackageDepth = Math.max(
    1,
    ...packages.map(packageName => packageName.split('.').length - scopeDepth)
  );

  return { packagePath, subPackageDepth };
}

/*** Returns the contiguous shared leading package segments for dotted package names. */
function getCommonPackageSegments(packages: readonly string[]): readonly string[] {
  const firstSegments = packages[0]?.split('.') ?? [];
  const remainingPackages = packages.slice(1);
  const mismatchIndex = firstSegments.findIndex((segment, index) =>
    remainingPackages.some(packageName => packageName.split('.')[index] !== segment)
  );

  return mismatchIndex === -1 ? firstSegments : firstSegments.slice(0, mismatchIndex);
}

interface CycleFocus {
  readonly packagePath: string;
  readonly subPackageDepth: number;
}
