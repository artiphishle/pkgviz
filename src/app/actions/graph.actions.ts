'use server';
import type { ElementsDefinition } from 'cytoscape';

import { buildGraph } from '@/app/utils/buildGraph';
import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';
import type { ProjectAnalysisActionResult } from '@/types/projectAnalysisActionResult';
import { runProjectAnalysisActionAsync } from '@/utils/runProjectAnalysisActionAsync';

/*** Builds the dependency graph for the configured project. */
export async function getGraphAction(): Promise<ProjectAnalysisActionResult<ElementsDefinition>> {
  return runProjectAnalysisActionAsync(async () => {
    const files = await getParsedFileStructure();
    return buildGraph(files);
  });
}
