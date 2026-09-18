'use server';
import type { ElementsDefinition } from 'cytoscape';

import { buildGraph } from '@/app/utils/buildGraph';
import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';
import { markCyclicPackagesWithEvidence } from '@/app/utils/markCyclicPackages';

export async function getGraphAction(): Promise<ElementsDefinition> {
  const files = await getParsedFileStructure();
  const graph = markCyclicPackagesWithEvidence(buildGraph(files), files);

  return graph;
}
