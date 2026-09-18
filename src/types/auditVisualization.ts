import type { PackageCycleDetail } from '@/types/audit';

export interface CycleHighlight {
  readonly id: string;
  readonly color: string;
  readonly cycle: PackageCycleDetail;
}
