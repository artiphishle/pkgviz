'use server';

import { createDependencyGraphFromInspectionsAsync } from '@ankhorage/dependency-graph';

import { inspectProjectForAnalysisAsync } from '@/features/project-analysis/adapters/outbound/project-detector/inspectProjectForAnalysisAsync';
import { parseProjectInspectionAsync } from '@/features/project-analysis/adapters/outbound/project-detector/parseProjectInspectionAsync';
import type { Language } from '@/shared/types';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';

import { selectParserLanguage } from './selectParserLanguage';

/*** Read one canonical inspection and reuse it for dependency evidence and parsed Tree projection. */
export async function getParsedFileStructure(
  language?: Language,
  projectPath: string = parseProjectPath()
) {
  const inspection = await inspectProjectForAnalysisAsync(projectPath);
  const dependencyGraph = await createDependencyGraphFromInspectionsAsync({
    projects: [{ id: 'current', inspection }],
  });
  const detectedLanguage = language ?? selectParserLanguage(inspection.detection).language;
  return parseProjectInspectionAsync(inspection, dependencyGraph, detectedLanguage, projectPath);
}
