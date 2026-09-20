import { createAuditFromSnapshot } from '@/features/audit/application/use-cases/createAuditFromSnapshot';
import { loadProjectSnapshotAsync } from '@/features/project-analysis/composition/loadProjectSnapshotAsync';
import type { Audit, ResolveAuditConfigurationInput } from '@/types/audit';

/*** Composes a fresh project snapshot and audit evaluation without UI environment state. */
export async function createAuditAsync(
  projectPath: string,
  configurationInput: ResolveAuditConfigurationInput = {}
): Promise<Audit> {
  return createAuditFromSnapshot(await loadProjectSnapshotAsync(projectPath), configurationInput);
}
