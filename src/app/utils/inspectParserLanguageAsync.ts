import { inspectProjectAsync } from '@ankhorage/project-detector/node';
import type { ParserSelection } from '../../types/parserSelection';
import { selectParserLanguage } from './selectParserLanguage';

/** Inspect safely through the canonical detector, then apply pkgviz's parser selection policy. */
export async function inspectParserLanguageAsync(projectPath: string): Promise<ParserSelection> {
  const inspection = await inspectProjectAsync(projectPath, {
    excludeDirectories: ['@types', '.github', 'examples', 'test'],
  });
  if (!inspection.complete) {
    throw new Error(
      `Project inspection is incomplete: ${inspection.diagnostics.map(diagnostic => diagnostic.message).join('; ')}`
    );
  }
  return selectParserLanguage(inspection.detection);
}
