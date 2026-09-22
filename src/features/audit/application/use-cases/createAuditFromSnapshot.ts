import { getPackageCyclesWithMembers } from '@/features/audit/application/use-cases/getPackageCyclesWithMembers';
import { evaluateAuditRules } from '@/features/audit/domain/evaluateAuditRules';
import { resolveAuditConfiguration } from '@/features/audit/domain/resolveAuditConfiguration';
import { getProjectName } from '@/shared/utils/getProjectName';
import type { Audit, ResolveAuditConfigurationInput } from '@/types/audit';
import type { ProjectSnapshot } from '@/types/projectAnalysis';

/*** Evaluates audit policy against the same files and weighted graph used by the visualization. */
export function createAuditFromSnapshot(
  snapshot: ProjectSnapshot,
  configurationInput: ResolveAuditConfigurationInput = {}
): Audit {
  const configuration = resolveAuditConfiguration(configurationInput);
  const cyclicPackages = getPackageCyclesWithMembers(snapshot.files, snapshot.packageGraph).cycles;
  const rules = evaluateAuditRules({ configuration, cyclicPackages });

  return {
    configuration,
    evaluation: { cyclicPackages, rules },
    files: snapshot.files,
    meta: {
      language: snapshot.language,
      projectName: getProjectName(snapshot.projectPath),
      timeStart: snapshot.timeStart,
      timeEnd: Date.now(),
    },
  };
}
