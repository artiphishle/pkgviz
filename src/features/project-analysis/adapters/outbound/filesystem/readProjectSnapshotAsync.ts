import { createDependencyGraphFromInspectionsAsync } from '@ankhorage/dependency-graph';
import { toCytoscapeElements } from '@ankhorage/graph-cytoscape';

import { selectParserLanguage } from '@/app/utils/selectParserLanguage';
import { projectDependencyGraph } from '@/features/dependency-analysis/application/use-cases/projectDependencyGraph';
import { inspectProjectForAnalysisAsync } from '@/features/project-analysis/adapters/outbound/project-detector/inspectProjectForAnalysisAsync';
import { parseProjectInspectionAsync } from '@/features/project-analysis/adapters/outbound/project-detector/parseProjectInspectionAsync';
import type { ProjectSnapshot } from '@/types/projectAnalysis';

/*** Read one project inspection and derive Tree, canonical package graph and Cytoscape projection. */
export async function readProjectSnapshotAsync(projectPath: string): Promise<ProjectSnapshot> {
  const timeStart = Date.now();
  const inspection = await inspectProjectForAnalysisAsync(projectPath);
  const dependencyGraph = await createDependencyGraphFromInspectionsAsync({
    projects: [{ id: 'current', inspection }],
  });
  const language = selectParserLanguage(inspection.detection);
  const files = await parseProjectInspectionAsync(
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
