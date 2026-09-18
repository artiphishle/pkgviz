import type { ProjectAnalysisActionResult } from '@/types/projectAnalysisActionResult';

/*** Run project analysis while serializing expected invalid-root failures across server actions. */
export async function runProjectAnalysisActionAsync<T>(
  operation: () => Promise<T>
): Promise<ProjectAnalysisActionResult<T>> {
  try {
    return { ok: true, value: await operation() };
  } catch (error) {
    if (error instanceof Error && error.name === 'ProjectPathUnavailableError') {
      return { ok: false, error: error.message };
    }
    throw error;
  }
}
