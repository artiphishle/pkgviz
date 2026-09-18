'use server';
import { relative } from 'node:path';

import type { ElementsDefinition } from 'cytoscape';

import { buildGraph } from '@/app/utils/buildGraph';
import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';
import { resolveRoot } from '@/app/utils/getParsedFileStructure';
import { inspectParserLanguageAsync } from '@/app/utils/inspectParserLanguageAsync';
import { markCyclicPackagesWithEvidence } from '@/app/utils/markCyclicPackages';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';

export async function getGraphAction(): Promise<ElementsDefinition> {
  const files = await getParsedFileStructure();
  const graph = markCyclicPackagesWithEvidence(buildGraph(files), files);

  return graph;
}

export async function getRootAction(): Promise<string> {
  const projectRoot = parseProjectPath();
  const { language } = await inspectParserLanguageAsync(projectRoot);
  const relativeRootDir = relative(projectRoot, await resolveRoot(projectRoot, language));

  return relativeRootDir;
}
