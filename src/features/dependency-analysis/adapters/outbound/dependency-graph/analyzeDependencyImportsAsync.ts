import path from 'node:path';

import {
  createDependencyGraphAsync,
  type DependencyGraphNodeData,
  type DependencyImportEvidence,
} from '@ankhorage/dependency-graph';

import type { ImportDefinition } from '@/shared/types';
import { toPosix } from '@/shared/utils/toPosix';

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
  const imports = new Map<string, ImportDefinition[]>();

  for (const edge of graph.edges) {
    const target = nodes.get(edge.target);
    if (target === undefined) {
      throw new Error(`Missing dependency-graph target node: ${edge.target}`);
    }

    const pkg = targetPackage(target);
    for (const evidence of edge.data.evidence) {
      if (pkg === '') continue;
      const sourceFile = toPosix(
        path.relative(analysisRoot, path.resolve(projectRoot, evidence.sourceFile))
      );
      const current = imports.get(sourceFile) ?? [];
      current.push({
        name: importNameMode === 'specifier' ? evidence.specifier : pkg,
        pkg,
        isIntrinsic: isIntrinsicImport(evidence, intrinsicMode),
      });
      imports.set(sourceFile, current);
    }
  }

  return imports;
}

type ImportNameMode = 'package' | 'specifier';
type ImportIntrinsicMode = 'canonical' | 'kotlin-standard-library';

/*** Preserves PKGViz presentation semantics independently from canonical graph classification. */
function isIntrinsicImport(evidence: DependencyImportEvidence, mode: ImportIntrinsicMode): boolean {
  if (mode === 'canonical') return evidence.classification === 'intrinsic';

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
