'use server';

import { parseProjectInspectionAsync } from '@/features/project-analysis/adapters/outbound/project-detector/parseProjectInspectionAsync';
import { inspectProjectForAnalysisAsync } from '@/features/project-analysis/adapters/outbound/project-detector/inspectProjectForAnalysisAsync';
import { Language } from '@/shared/types';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';

import { selectParserLanguage } from './selectParserLanguage';

/*** Read the canonical project inventory and project it through the selected PKGViz parser. */
export async function getParsedFileStructure(
  language?: Language,
  projectPath: string = parseProjectPath()
) {
  const inspection = await inspectProjectForAnalysisAsync(projectPath);
  const detectedLanguage = language ?? selectParserLanguage(inspection.detection).language;
  return parseProjectInspectionAsync(inspection, detectedLanguage, projectPath);
}
