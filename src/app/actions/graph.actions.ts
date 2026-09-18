'use server';
import type { ElementsDefinition } from 'cytoscape';

import { buildGraph } from '@/app/utils/buildGraph';
import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';
import { markCyclicPackagesWithEvidence } from '@/app/utils/markCyclicPackages';
import { runProjectAnalysisActionAsync } from '@/app/utils/runProjectAnalysisActionAsync';
import type { ProjectAnalysisActionResult } from '@/types/projectAnalysisActionResult';

/*** Builds the dependency graph for the configured project. */
export async function getGraphAction(): Promise<ProjectAnalysisActionResult<ElementsDefinition>> {
  return runProjectAnalysisActionAsync(async () => {
    const files = await getParsedFileStructure();
    return markCyclicPackagesWithEvidence(buildGraph(files), files);
  });
}
