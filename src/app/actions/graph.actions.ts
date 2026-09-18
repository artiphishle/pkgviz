'use server';
import type { ElementsDefinition } from 'cytoscape';

import { buildGraph } from '@/app/utils/buildGraph';
import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';
import { markCyclicPackagesWithEvidence } from '@/app/utils/markCyclicPackages';
import type { ProjectAnalysisActionResult } from '@/types/projectAnalysisActionResult';
import { runProjectAnalysisActionAsync } from '@/utils/runProjectAnalysisActionAsync';

/*** Builds the dependency graph for the configured project. */
export async function getGraphAction(): Promise<ProjectAnalysisActionResult<ElementsDefinition>> {
  return runProjectAnalysisActionAsync(async () => {
    const files = await getParsedFileStructure();
    return markCyclicPackagesWithEvidence(buildGraph(files), files);
  });
}
