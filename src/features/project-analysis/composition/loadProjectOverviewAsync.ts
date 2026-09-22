import { createAuditFromSnapshot } from '@/features/audit/application/use-cases/createAuditFromSnapshot';
import { loadProjectSnapshotAsync } from '@/features/project-analysis/composition/loadProjectSnapshotAsync';
import { buildProjectTree } from '@/features/project-tree/application/use-cases/buildProjectTree';
import type { ProjectOverview } from '@/types/projectAnalysis';

/*** Derives canonical package graph, tree and audit evaluation from one shared snapshot. */
export async function loadProjectOverviewAsync(projectPath: string): Promise<ProjectOverview> {
  const snapshot = await loadProjectSnapshotAsync(projectPath);
  return {
    packageGraph: snapshot.packageGraph,
    tree: buildProjectTree(snapshot.files),
    evaluation: createAuditFromSnapshot(snapshot).evaluation,
  };
}
