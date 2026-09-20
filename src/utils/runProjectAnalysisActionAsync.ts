import { toErrorMessage } from '@ankhorage/utility/error';

import type { ProjectAnalysisActionResult } from '@/types/projectAnalysisActionResult';

/*** Runs project analysis while serializing failures for the persistent project error UI. */
export async function runProjectAnalysisActionAsync<T>(
  operation: () => Promise<T>
): Promise<ProjectAnalysisActionResult<T>> {
  try {
    return { ok: true, value: await operation() };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error, 'Unable to load project.') };
  }
}
