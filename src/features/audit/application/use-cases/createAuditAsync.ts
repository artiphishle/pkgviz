import { buildGraph } from '@/app/utils/buildGraph';
import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';
import { inspectParserLanguageAsync } from '@/app/utils/inspectParserLanguageAsync';
import { getPackageCyclesWithMembers } from '@/app/utils/markCyclicPackages';
import { evaluateAuditRules } from '@/features/audit/domain/evaluateAuditRules';
import { resolveAuditConfiguration } from '@/features/audit/domain/resolveAuditConfiguration';
import { getProjectName } from '@/shared/utils/getProjectName';
import type { Audit, ResolveAuditConfigurationInput } from '@/types/audit';

/*** Builds a complete audit for an explicit project path without UI environment state. */
export async function createAuditAsync(
  projectPath: string,
  configurationInput: ResolveAuditConfigurationInput = {}
): Promise<Audit> {
  const timeStart = Date.now();
  const configuration = resolveAuditConfiguration(configurationInput);
  const language = await inspectParserLanguageAsync(projectPath);
  const files = await getParsedFileStructure(language.language, projectPath);
  const graph = buildGraph(files);
  const cyclicPackages = getPackageCyclesWithMembers(files, graph).cycles;
  const rules = evaluateAuditRules({ configuration, cyclicPackages });

  return {
    configuration,
    evaluation: {
      cyclicPackages,
      rules,
    },
    files,
    meta: {
      language,
      projectName: getProjectName(projectPath),
      timeStart,
      timeEnd: Date.now(),
    },
  };
}
