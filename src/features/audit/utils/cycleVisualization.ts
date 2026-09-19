import type { PackageCycleDetail } from '@/types/audit';
import type { CycleFocus, CycleHighlight, CycleInspection } from '@/types/auditVisualization';

const CYCLE_ERROR_COLORS = [
  '#d80303',
  '#b91c1c',
  '#ef4444',
  '#991b1b',
  '#dc2626',
  '#f87171',
  '#7f1d1d',
  '#fca5a5',
] as const;

/*** Returns a stable distinct error-red color for one cycle occurrence. */
export function getCycleColor(index: number): string {
  return CYCLE_ERROR_COLORS[index % CYCLE_ERROR_COLORS.length];
}

/*** Returns the stable UI identity for one cycle occurrence. */
export function getCycleId(cycle: PackageCycleDetail, index: number): string {
  return cycle.packages.join('→') + ':' + index;
}

/*** Creates one stable cycle highlight descriptor. */
function createCycleHighlight(cycle: PackageCycleDetail, index: number): CycleHighlight {
  return {
    id: getCycleId(cycle, index),
    color: getCycleColor(index),
    cycle,
  };
}

/*** Creates graph highlights for the selected cycle occurrence IDs. */
export function createCycleHighlights(
  cycles: readonly PackageCycleDetail[],
  selectedCycleIds: readonly string[]
): readonly CycleHighlight[] {
  return cycles.flatMap((cycle, index) => {
    const id = getCycleId(cycle, index);
    return selectedCycleIds.includes(id) ? [createCycleHighlight(cycle, index)] : [];
  });
}

/*** Creates the narrowest graph scope and least package depth that contain all selected cycles. */
export function createCycleFocus(
  cycles: readonly PackageCycleDetail[],
  selectedCycleIds: readonly string[]
): CycleFocus | null {
  const packageNames = [
    ...new Set(
      cycles.flatMap((cycle, index) =>
        selectedCycleIds.includes(getCycleId(cycle, index)) ? cycle.packages : []
      )
    ),
  ];
  if (packageNames.length === 0) return null;

  const packageSegments = packageNames.map(packageName => packageName.split('.'));
  const [firstSegments, ...remainingSegments] = packageSegments;
  const mismatchIndex = firstSegments.findIndex((segment, index) =>
    remainingSegments.some(segments => segments.at(index) !== segment)
  );
  const commonDepth = mismatchIndex === -1 ? firstSegments.length : mismatchIndex;
  const commonSegments = firstSegments.slice(0, commonDepth);
  const commonPackage = commonSegments.join('.');
  const focusSegments = packageNames.includes(commonPackage)
    ? commonSegments.slice(0, -1)
    : commonSegments;

  return {
    currentPackage: focusSegments.join('.'),
    packageDepth: Math.max(
      1,
      ...packageSegments.map(segments => segments.length - focusSegments.length)
    ),
  };
}

/*** Creates the inspector descriptor for one cycle row. */
export function createCycleInspection(
  cycle: PackageCycleDetail,
  index: number,
  label: string
): CycleInspection {
  return {
    ...createCycleHighlight(cycle, index),
    label,
  };
}
