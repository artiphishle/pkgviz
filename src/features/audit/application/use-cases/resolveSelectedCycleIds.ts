import { isRecord } from '@ankhorage/utility/object';

import { getCycleId } from '@/features/audit/utils/cycleVisualization';
import type { PackageCycleDetail } from '@/types/audit';

/*** Resolves explicit per-cycle choices before the environment default, ignoring invalid storage. */
export function resolveSelectedCycleIds(
  cycles: readonly PackageCycleDetail[],
  stored: unknown,
  enabledByDefault: boolean
): readonly string[] {
  const choices = new Map(isRecord(stored) ? Object.entries(stored) : []);
  return cycles.flatMap(cycle => {
    const id = getCycleId(cycle);
    const choice = choices.get(id);
    return (typeof choice === 'boolean' ? choice : enabledByDefault) ? [id] : [];
  });
}
