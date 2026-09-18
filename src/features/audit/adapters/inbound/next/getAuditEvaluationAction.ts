'use server';

import { createAuditAsync } from '@/features/audit/application/use-cases/createAuditAsync';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';
import type { AuditEvaluation } from '@/types/audit';

/*** Returns only serializable audit evaluation data for client-side rule inspection. */
export async function getAuditEvaluationAction(): Promise<AuditEvaluation> {
  const audit = await createAuditAsync(parseProjectPath());
  return audit.evaluation;
}
