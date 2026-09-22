import type { ElementsDefinition } from 'cytoscape';

import type { ParsedDirectory } from '@/shared/types';
import type { Audit } from '@/types/audit';
import type { PackageDependencyGraph } from '@/types/dependencyAnalysis';
import type { ParserSelection } from '@/types/parserSelection';
import type { ProjectTreeNode } from '@/types/projectTree';

export interface ProjectSnapshot {
  readonly files: ParsedDirectory;
  readonly graph: ElementsDefinition;
  readonly packageGraph: PackageDependencyGraph;
  readonly language: ParserSelection;
  readonly projectPath: string;
  readonly timeStart: number;
}

export interface ProjectOverview {
  readonly graph: ElementsDefinition;
  readonly tree: readonly ProjectTreeNode[];
  readonly evaluation: Audit['evaluation'];
}
