import type { PackageCycleDetail } from '@/types/audit';

export interface CycleHighlight {
  readonly id: string;
  readonly color: string;
  readonly cycle: PackageCycleDetail;
}

export interface CycleInspection extends CycleHighlight {
  readonly label: string;
}

export interface CycleFocus {
  readonly currentPackage: string;
  readonly packageDepth: number;
}

export interface CycleSelection {
  readonly highlights: readonly CycleHighlight[];
  readonly selectedIds: readonly string[];
  readonly setSelected: (id: string, selected: boolean) => void;
}
