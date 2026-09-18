import type { Graph, GraphEdge, GraphNode } from '@ankhorage/graph';
import { toCytoscapeElements } from '@ankhorage/graph-cytoscape';
import type { ElementsDefinition } from 'cytoscape';

import type { ParsedDirectory, ParsedFile } from '@/shared/types';

/***
 * Builds a weighted dependency graph and converts it through the canonical Cytoscape adapter.
 */
export function buildGraph(dir: ParsedDirectory): ElementsDefinition {
  const graph = buildCanonicalGraph(dir);

  return toCytoscapeElements(graph, {
    nodeClasses: node => (node.data.isIntrinsic === true ? undefined : 'isVendor'),
  });
}

/*** Builds PKGViz package dependencies in the canonical Ankhorage graph model. */
function buildCanonicalGraph(
  dir: ParsedDirectory
): Graph<PackageNodeData, PackageEdgeData> {
  const { nodes, edges } = buildGraphRecursively(dir);

  for (const edge of edges.values()) {
    for (const endpoint of [edge.source, edge.target]) {
      if (nodes.some(node => node.id === endpoint)) continue;

      const parent = endpoint.includes('.')
        ? endpoint.split('.').slice(0, -1).join('.')
        : '';
      const name = endpoint.split('.').pop() || endpoint;

      nodes.push({
        id: endpoint,
        data: {
          label: endpoint,
          path: endpoint,
          parent,
          name,
        },
      });
    }
  }

  return {
    nodes,
    edges: Array.from(edges.values()),
  };
}

/*** Recursively collects intrinsic package nodes and weighted dependency edges. */
function buildGraphRecursively(
  currentDir: ParsedDirectory,
  currentPath = '',
  nodes: GraphNode<PackageNodeData>[] = [],
  edges = new Map<string, GraphEdge<PackageEdgeData>>()
): CanonicalGraphAccumulator {
  for (const key of Object.keys(currentDir)) {
    const dirOrFile = (currentDir as Record<string, ParsedDirectory | ParsedFile>)[key];
    const isDirectory = !(dirOrFile as ParsedFile)?.className;

    if (isDirectory) {
      const pkg = currentPath ? `${currentPath}.${key}` : key;

      nodes.push({
        id: pkg,
        data: {
          path: pkg,
          parent: currentPath,
          label: key,
          name: key.split('.').pop() || key,
          isIntrinsic: true,
        },
      });

      buildGraphRecursively(dirOrFile as ParsedDirectory, pkg, nodes, edges);
      continue;
    }

    const file = dirOrFile as ParsedFile;
    const source = file.package?.trim();
    if (!source) continue;

    const targets = (file.imports ?? [])
      .map(imp => imp.pkg?.trim())
      .filter((target): target is string => Boolean(target));

    for (const target of targets) {
      if (target === source) continue;

      const edgeId = `${source}->${target}`;
      const existing = edges.get(edgeId);
      const weight = (existing?.data.weight ?? 0) + 1;

      edges.set(edgeId, {
        id: edgeId,
        source,
        target,
        data: { weight },
      });
    }
  }

  return { nodes, edges };
}

interface PackageNodeData extends Readonly<Record<string, unknown>> {
  readonly path: string;
  readonly parent: string;
  readonly label: string;
  readonly name: string;
  readonly isIntrinsic?: boolean;
}

interface PackageEdgeData extends Readonly<Record<string, unknown>> {
  readonly weight: number;
}

interface CanonicalGraphAccumulator {
  readonly nodes: GraphNode<PackageNodeData>[];
  readonly edges: Map<string, GraphEdge<PackageEdgeData>>;
}
