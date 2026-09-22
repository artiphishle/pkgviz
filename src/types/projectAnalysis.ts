import type { Audit } from '@/types/audit';
import type { PackageDependencyGraph } from '@/types/dependencyAnalysis';
import type { ParserSelection } from '@/types/parserSelection';
import type { ProjectFileTree } from '@/types/projectFiles';
import type { ProjectTreeNode } from '@/types/projectTree';

export interface ProjectSnapshot {
  readonly files: ProjectFileTree;
  readonly packageGraph: PackageDependencyGraph;
  readonly language: ParserSelection;
  readonly projectPath: string;
  readonly timeStart: number;
}

export interface ProjectOverview {
  readonly packageGraph: PackageDependencyGraph;
  readonly tree: readonly ProjectTreeNode[];
  readonly evaluation: Audit['evaluation'];
}
