import { inspectProjectAsync } from '@ankhorage/project-detector/node';

import type { ParserSelection } from '../../types/parserSelection';
import { selectParserLanguage } from './selectParserLanguage';

const PROJECT_PATH_ERROR_CODES: ReadonlySet<string> = new Set(['EACCES', 'ENOENT', 'ENOTDIR']);

/*** Inspect safely through the canonical detector, then apply pkgviz's parser selection policy. */
export async function inspectParserLanguageAsync(projectPath: string): Promise<ParserSelection> {
  try {
    const inspection = await inspectProjectAsync(projectPath, {
      excludeDirectories: ['@types', '.github', 'examples', 'test'],
    });
    if (!inspection.complete) {
      throw new Error(
        `Project inspection is incomplete: ${inspection.diagnostics.map(diagnostic => diagnostic.message).join('; ')}`
      );
    }
    return selectParserLanguage(inspection.detection);
  } catch (error) {
    if (!isProjectPathUnavailableError(error)) throw error;

    const projectPathError = new Error(`Invalid or unavailable project path: ${projectPath}`, {
      cause: error,
    });
    projectPathError.name = 'ProjectPathUnavailableError';
    throw projectPathError;
  }
}

/*** Identify filesystem errors that mean the configured inspection root cannot be used. */
function isProjectPathUnavailableError(error: unknown): boolean {
  return (
    error instanceof Error &&
    'code' in error &&
    typeof error.code === 'string' &&
    PROJECT_PATH_ERROR_CODES.has(error.code)
  );
}
