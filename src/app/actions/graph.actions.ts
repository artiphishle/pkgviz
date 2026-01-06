'use server';
import type { ElementsDefinition } from 'cytoscape';

import { markCyclicPackagesWithEvidence } from '@/app/utils/markCyclicPackages';
import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';
import { buildGraph } from '@/app/utils/buildGraph';
import { relative } from 'node:path';
import { detectLanguage } from '@/shared/utils/detectLanguage';
import { resolveRoot } from '@/app/utils/getParsedFileStructure';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';

export async function getGraphAction(): Promise<ElementsDefinition> {
  const files = await getParsedFileStructure();
  const graph = markCyclicPackagesWithEvidence(buildGraph(files), files);

  return graph;
}

export async function getRootAction(): Promise<string> {
  const projectRoot = parseProjectPath();
  const { language } = await detectLanguage(projectRoot);
  const relativeRootDir = relative(projectRoot, await resolveRoot(projectRoot, language));

  return relativeRootDir;
}
