import { resolveFileSystemPathWithinRoot, writeFileWithinRoot } from '@ankhorage/utility/node/fs';

import { createAuditAsync } from '@/features/audit/application/use-cases/createAuditAsync';
import { hasBlockingAuditRuleFailure } from '@/features/audit/domain/hasBlockingAuditRuleFailure';
import type { Audit } from '@/types/audit';

/*** Creates, writes, and evaluates an audit while retaining the artifact on rule failure. */
export async function runAuditAsync(input: RunAuditInput): Promise<RunAuditResult> {
  const audit = await createAuditAsync(input.projectPath);
  const artifactPath = resolveFileSystemPathWithinRoot(input.projectPath, input.outputPath);
  const body = input.pretty ? JSON.stringify(audit, null, 2) : JSON.stringify(audit);

  await writeFileWithinRoot({
    rootPath: input.projectPath,
    filePath: artifactPath,
    body: new TextEncoder().encode(body),
    exclusive: false,
  });

  return {
    audit,
    artifactPath,
    exitCode: hasBlockingAuditRuleFailure(audit.evaluation.rules) ? 2 : 0,
  };
}

interface RunAuditInput {
  readonly projectPath: string;
  readonly outputPath: string;
  readonly pretty: boolean;
}

interface RunAuditResult {
  readonly audit: Audit;
  readonly artifactPath: string;
  readonly exitCode: 0 | 2;
}
