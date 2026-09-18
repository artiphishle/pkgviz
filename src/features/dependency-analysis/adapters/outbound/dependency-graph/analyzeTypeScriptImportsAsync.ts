import {
  createDependencyGraphAsync,
  type DependencyGraphNodeData,
} from '@ankhorage/dependency-graph';

import type { ImportDefinition } from '@/shared/types';

/***
 * Returns PKGViz import definitions indexed by source file from the canonical TypeScript analyzer.
 */
export async function analyzeTypeScriptImportsAsync(
  projectRoot: string
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
      const current = imports.get(evidence.sourceFile) ?? [];
      current.push({
        name: pkg,
        pkg,
        isIntrinsic: evidence.classification === 'intrinsic',
      });
      imports.set(evidence.sourceFile, current);
    }
  }

  return imports;
}

/*** Maps canonical dependency-graph node metadata to PKGViz package notation. */
function targetPackage(target: DependencyGraphNodeData): string {
  if (target.kind === 'module') return target.path ?? '';
  if (target.classification === 'intrinsic' && target.focus && target.path === '.') return '';
  return target.packageName ?? target.label;
}
