'use server';
import { NextResponse } from 'next/server';
import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';
import { markCyclicPackagesWithEvidence } from '@/app/utils/markCyclicPackages';
import { buildGraph } from '@/app/utils/buildGraph';

export async function GET() {
  const files = await getParsedFileStructure();
  const graph = markCyclicPackagesWithEvidence(buildGraph(files), files);

  return NextResponse.json(graph);
}
