'use server';

import { runProjectAnalysisActionAsync } from '@/app/utils/runProjectAnalysisActionAsync';
import { createAuditAsync } from '@/features/audit/application/use-cases/createAuditAsync';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';
import type { AuditEvaluation } from '@/types/audit';
import type { ProjectAnalysisActionResult } from '@/types/projectAnalysisActionResult';

/*** Returns only serializable audit evaluation data for client-side rule inspection. */
export async function getAuditEvaluationAction(): Promise<
  ProjectAnalysisActionResult<AuditEvaluation>
> {
  return runProjectAnalysisActionAsync(async () => {
    const audit = await createAuditAsync(parseProjectPath());
    return audit.evaluation;
  });
}
