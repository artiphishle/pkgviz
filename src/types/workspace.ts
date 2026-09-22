import type { Audit } from '@/types/audit';
import type { PackageDependencyGraph } from '@/types/dependencyAnalysis';
import type { ProjectTreeNode } from '@/types/projectTree';

export interface ProjectOverview {
  readonly packageGraph: PackageDependencyGraph;
  readonly tree: readonly ProjectTreeNode[];
  readonly evaluation: Audit['evaluation'];
}
