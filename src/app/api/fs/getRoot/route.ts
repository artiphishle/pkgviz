'use server';
import { NextResponse } from 'next/server';
import { relative } from 'node:path';
import { detectLanguage } from '@/shared/utils/detectLanguage';
import { resolveRoot } from '@/app/utils/getParsedFileStructure';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';

export async function GET() {
  const projectRoot = parseProjectPath();
  const { language } = await detectLanguage(projectRoot);
  const relativeRootDir = relative(projectRoot, await resolveRoot(projectRoot, language));

  return NextResponse.json(relativeRootDir);
}
