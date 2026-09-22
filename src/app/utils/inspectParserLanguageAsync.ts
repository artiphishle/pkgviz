import { inspectProjectForAnalysisAsync } from '../../features/project-analysis/adapters/outbound/project-detector/inspectProjectForAnalysisAsync';
import type { ParserSelection } from '../../types/parserSelection';
import { selectParserLanguage } from './selectParserLanguage';

/*** Inspect safely through the canonical detector, then apply pkgviz's parser selection policy. */
export async function inspectParserLanguageAsync(projectPath: string): Promise<ParserSelection> {
  const inspection = await inspectProjectForAnalysisAsync(projectPath);
  return selectParserLanguage(inspection.detection);
}
