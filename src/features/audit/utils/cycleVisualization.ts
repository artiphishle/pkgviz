import type { PackageCycleDetail } from '@/types/audit';
import type { CycleHighlight, CycleInspection } from '@/types/auditVisualization';

/*** Returns a stable distinct color for one cycle while keeping the first cycle PKGViz red. */
export function getCycleColor(index: number): string {
  if (index === 0) return '#d80303';
  const hue = Math.round((index * 137.508) % 360);
  return 'hsl(' + hue + ' 68% 45%)';
}

/*** Returns the stable UI identity for one cycle occurrence. */
export function getCycleId(cycle: PackageCycleDetail, index: number): string {
  return cycle.packages.join('→') + ':' + index;
}

/*** Creates one stable cycle highlight descriptor. */
export function createCycleHighlight(cycle: PackageCycleDetail, index: number): CycleHighlight {
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
