import { readFile } from 'node:fs/promises';
import path from 'node:path';

import {
  createDependencyGraphAsync,
  type DependencyGraphNodeData,
  type DependencyImportEvidence,
} from '@ankhorage/dependency-graph';

import type { ImportDefinition } from '@/shared/types';
import { toPosix } from '@/shared/utils/toPosix';

interface OrderedImport {
  readonly definition: ImportDefinition;
  readonly position: number;
  readonly ordinal: number;
}

/*** Returns PKGViz import definitions from the canonical dependency analyzer. */
export async function analyzeDependencyImportsAsync(
  projectRoot: string,
  analysisRoot: string = projectRoot,
  importNameMode: ImportNameMode = 'package',
  intrinsicMode: ImportIntrinsicMode = 'canonical'
): Promise<ReadonlyMap<string, readonly ImportDefinition[]>> {
  const graph = await createDependencyGraphAsync({
    projects: [{ id: 'current', rootPath: projectRoot }],
  });
  const nodes = new Map(graph.nodes.map(node => [node.id, node.data] as const));
  const imports = new Map<string, OrderedImport[]>();
  const sourceTextByFile = new Map<string, Promise<string>>();
  let ordinal = 0;

  for (const edge of graph.edges) {
    const target = nodes.get(edge.target);
    if (target === undefined) {
      throw new Error(`Missing dependency-graph target node: ${edge.target}`);
    }

    const pkg = targetPackage(target);
    for (const evidence of edge.data.evidence) {
      if (pkg === '') continue;
      const absoluteSourceFile = path.resolve(projectRoot, evidence.sourceFile);
      const sourceFile = toPosix(path.relative(analysisRoot, absoluteSourceFile));
      const sourceText = await readSourceTextAsync(sourceTextByFile, absoluteSourceFile);
      const current = imports.get(sourceFile) ?? [];
      current.push({
        definition: {
          name: importNameMode === 'specifier' ? evidence.specifier : pkg,
          pkg,
          isIntrinsic: isIntrinsicImport(evidence, intrinsicMode),
        },
        position: sourceText.indexOf(evidence.specifier),
        ordinal,
      });
      ordinal += 1;
      imports.set(sourceFile, current);
    }
  }

  return new Map(
    [...imports].map(([sourceFile, entries]) => [
      sourceFile,
      entries
        .sort((left, right) => {
          const leftPosition = left.position < 0 ? Number.MAX_SAFE_INTEGER : left.position;
          const rightPosition = right.position < 0 ? Number.MAX_SAFE_INTEGER : right.position;
          return leftPosition - rightPosition || left.ordinal - right.ordinal;
        })
        .map(({ definition }) => definition),
    ])
  );
}

type ImportNameMode = 'package' | 'specifier';
type ImportIntrinsicMode = 'canonical' | 'kotlin-standard-library' | 'python-legacy';

/*** Reads source content once so adapter output preserves source declaration order. */
function readSourceTextAsync(
  cache: Map<string, Promise<string>>,
  sourceFile: string
): Promise<string> {
  const cached = cache.get(sourceFile);
  if (cached !== undefined) return cached;

  const sourceText = readFile(sourceFile, 'utf8');
  cache.set(sourceFile, sourceText);
  return sourceText;
}

/*** Preserves PKGViz presentation semantics independently from canonical graph classification. */
function isIntrinsicImport(evidence: DependencyImportEvidence, mode: ImportIntrinsicMode): boolean {
  if (mode === 'canonical') return evidence.classification === 'intrinsic';
  if (mode === 'python-legacy') return evidence.specifier.startsWith('.');

  return (
    evidence.specifier.startsWith('kotlin.') ||
    evidence.specifier.startsWith('java.') ||
    evidence.specifier.startsWith('javax.')
  );
}

/*** Maps canonical dependency-graph node metadata to PKGViz package notation. */
function targetPackage(target: DependencyGraphNodeData): string {
  if (target.kind === 'module') return target.path ?? '';
  if (target.classification === 'intrinsic' && target.focus && target.path === '.') return '';
  return target.packageName ?? target.label;
}
