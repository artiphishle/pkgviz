'use server';
import type { LanguageDetectionResult, ParsedDirectory } from '@/shared/types';

import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';
import { detectLanguage } from '@/shared/utils/detectLanguage';
import {
  getPackageCyclesWithMembers,
  type PackageCycleDetail,
} from '@/app/utils/markCyclicPackages';
import { buildGraph } from '@/app/utils/buildGraph';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';
import { getProjectName } from '@/shared/utils/getProjectName';
import { js2xml } from 'xml-js';

export async function getAuditAction(): Promise<Audit> {
  const projectPath = parseProjectPath();
  const projectName = getProjectName();
  const timeStart = Date.now();
  const language = await detectLanguage(projectPath);
  const files = await getParsedFileStructure();
  const graph = buildGraph(files);
  const cyclicPackages = getPackageCyclesWithMembers(files, graph).cycles;

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

export async function downloadAuditJsonAction(): Promise<{ data: string; filename: string }> {
  const audit = await getAuditAction();
  const jsonString = JSON.stringify(audit, null, 2);
  const filename = 'audit.json';

  return { data: jsonString, filename };
}

export async function downloadAuditXmlAction(): Promise<{ data: string; filename: string }> {
  const audit = await getAuditAction();
  const xmlString = js2xml({ audit }, { compact: true, spaces: 2 });
  const filename = `socomo-${audit.meta.timeEnd}-${audit.meta.projectName}-audit.xml`;

  return { data: xmlString, filename };
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
