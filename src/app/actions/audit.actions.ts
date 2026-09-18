'use server';
import { js2xml } from 'xml-js';

import { createAuditAsync } from '@/features/audit/application/use-cases/createAuditAsync';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';
import type { Audit } from '@/types/audit';
import type { ProjectAnalysisActionResult } from '@/types/projectAnalysisActionResult';
import { runProjectAnalysisActionAsync } from '@/utils/runProjectAnalysisActionAsync';

/*** Builds the audit payload for the configured project. */
export async function getAuditAction(): Promise<Audit> {
  return await createAuditAsync(parseProjectPath());
}

/*** Returns the serializable audit evaluation required by the client rule panel. */
export async function getAuditEvaluationAction(): Promise<
  ProjectAnalysisActionResult<Audit['evaluation']>
> {
  return runProjectAnalysisActionAsync(async () => (await getAuditAction()).evaluation);
}

/*** Serializes the current project audit as JSON. */
export async function downloadAuditJsonAction(): Promise<{ data: string; filename: string }> {
  const audit = await getAuditAction();
  const jsonString = JSON.stringify(audit, null, 2);
  const filename = 'audit.json';

  return { data: jsonString, filename };
}

/*** Serializes the current project audit as XML. */
export async function downloadAuditXmlAction(): Promise<{ data: string; filename: string }> {
  const audit = await getAuditAction();
  const xmlString = js2xml({ audit }, { compact: true, spaces: 2 });
  const filename = `socomo-${audit.meta.timeEnd}-${audit.meta.projectName}-audit.xml`;

  return { data: xmlString, filename };
}
