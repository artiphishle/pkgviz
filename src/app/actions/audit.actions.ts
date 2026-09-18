'use server';
import { js2xml } from 'xml-js';

import { buildGraph } from '@/app/utils/buildGraph';
import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';
import { inspectParserLanguageAsync } from '@/app/utils/inspectParserLanguageAsync';
import {
  getPackageCyclesWithMembers,
  type PackageCycleDetail,
} from '@/app/utils/markCyclicPackages';
import type { ParsedDirectory } from '@/shared/types';
import { getProjectName } from '@/shared/utils/getProjectName';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';
import type { ParserSelection } from '@/types/parserSelection';

export async function getAuditAction(): Promise<Audit> {
  const projectPath = parseProjectPath();
  const projectName = getProjectName();
  const timeStart = Date.now();
  const language = await inspectParserLanguageAsync(projectPath);
  const files = await getParsedFileStructure(language.language);
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
  readonly language: ParserSelection;
  readonly projectName: string;
}

export interface Audit {
  readonly evaluation: {
    readonly cyclicPackages: PackageCycleDetail[];
  };
  readonly meta: AuditMeta;
  readonly files: ParsedDirectory;
}
