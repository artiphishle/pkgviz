import { createDependencyGraphFromInspectionsAsync } from '@ankhorage/dependency-graph';
import { toCytoscapeElements } from '@ankhorage/graph-cytoscape';

import { projectDependencyGraph } from '@/features/dependency-analysis/application/use-cases/projectDependencyGraph';
import { inspectProjectForAnalysisAsync } from '@/features/project-analysis/adapters/outbound/project-detector/inspectProjectForAnalysisAsync';
import { selectParserLanguage } from '@/features/project-analysis/application/use-cases/selectParserLanguage';
import { createProjectFileTreeAsync } from '@/features/project-analysis/composition/createProjectFileTreeAsync';
import type { ProjectSnapshot } from '@/types/projectAnalysis';

/*** Read one project inspection and derive Tree, canonical package graph and Cytoscape projection. */
export async function readProjectSnapshotAsync(projectPath: string): Promise<ProjectSnapshot> {
  const timeStart = Date.now();
  const inspection = await inspectProjectForAnalysisAsync(projectPath);
  const dependencyGraph = await createDependencyGraphFromInspectionsAsync({
    projects: [{ id: 'current', inspection }],
  });
  const language = selectParserLanguage(inspection.detection);
  const files = await createProjectFileTreeAsync(
    inspection,
    dependencyGraph,
    language.language,
    projectPath
  );
  const packageGraph = projectDependencyGraph(dependencyGraph);
  const graph = toCytoscapeElements(packageGraph, {
    nodeClasses: node => (node.data.isIntrinsic === true ? undefined : 'isVendor'),
  });

  return { files, graph, packageGraph, language, projectPath, timeStart };
}
