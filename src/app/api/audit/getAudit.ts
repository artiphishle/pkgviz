'use server';
import type { LanguageDetectionResult, ParsedDirectory } from '@/shared/types';

import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';
import { detectLanguage } from '@/shared/utils/detectLanguage';
import { getPackageCyclesWithMembers, PackageCycleDetail } from '@/app/utils/markCyclicPackages';
import { buildGraph } from '@/app/utils/buildGraph';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';
import { getProjectName } from '@/shared/utils/getProjectName';

/**
 * Returns audit for JSON or XML exports
 */
export async function getAudit() {
  const projectPath = parseProjectPath();
  const projectName = getProjectName();
  const timeStart = Date.now();
  const language = await detectLanguage(projectPath);
  const files = await getParsedFileStructure();
  const graph = buildGraph(files);
  const cyclicPackages = getPackageCyclesWithMembers(files, graph).cycles;

  // 1. Build audit object
  const audit: Partial<Audit> = {
    evaluation: {
      cyclicPackages,
    },
    files,
    meta: {
      language,
      projectName,
      timeStart,
      timeEnd: timeStart,
    },
  };

  audit.meta!.timeEnd = Date.now();

  return audit as Audit;
}

interface AuditMeta {
  timeEnd: number;
  readonly timeStart: number;
  readonly language: LanguageDetectionResult;
  readonly projectName: string;
}

export interface Audit {
  readonly evaluation: {
    readonly cyclicPackages: PackageCycleDetail[];
  };
  readonly meta: AuditMeta;
  readonly files: ParsedDirectory;
}
