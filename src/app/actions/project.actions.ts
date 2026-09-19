'use server';

import { buildGraph } from '@/app/utils/buildGraph';
import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';
import { buildProjectTree } from '@/features/project-tree/application/use-cases/buildProjectTree';
import type { ProjectAnalysisActionResult } from '@/types/projectAnalysisActionResult';
import type { ProjectVisualization } from '@/types/projectTree';
import { runProjectAnalysisActionAsync } from '@/utils/runProjectAnalysisActionAsync';

/*** Loads one parsed-project snapshot and derives both graph and sidebar tree projections. */
export async function getProjectVisualizationAction(): Promise<
  ProjectAnalysisActionResult<ProjectVisualization>
> {
  return runProjectAnalysisActionAsync(async () => {
    const parsedProject = await getParsedFileStructure();
    return {
      graph: buildGraph(parsedProject),
      tree: buildProjectTree(parsedProject),
    };
  });
}
