import type { PackageDependencyGraph } from '@/types/dependencyAnalysis';
import type { ParserSelection } from '@/types/parserSelection';
import type { ProjectFileTree } from '@/types/projectFiles';

export interface ProjectSnapshot {
  readonly files: ProjectFileTree;
  readonly packageGraph: PackageDependencyGraph;
  readonly language: ParserSelection;
  readonly projectPath: string;
  readonly timeStart: number;
}
