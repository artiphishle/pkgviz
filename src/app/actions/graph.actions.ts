'use server';
import type { ElementsDefinition } from 'cytoscape';

import { buildGraph } from '@/app/utils/buildGraph';
import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';

/*** Builds the dependency graph for the configured project. */
export async function getGraphAction(): Promise<ElementsDefinition> {
  const files = await getParsedFileStructure();
  return buildGraph(files);
}
