import { findCyclePath, findCyclicComponents, type Graph } from '@ankhorage/graph';
import type { ElementsDefinition } from 'cytoscape';

import type { ParsedDirectory, ParsedFile } from '@/shared/types';
import type { CycleEdgeEvidence, ImportEvidence, PackageCycleDetail } from '@/types/audit';

/*** Collect all files from your ParsedDirectory tree. */
function collectFiles(root: ParsedDirectory): ParsedFile[] {
  const files: ParsedFile[] = [];
  /*** Collects parsed files by traversing the parsed directory tree. */
  const walk = (dir: ParsedDirectory) => {
    for (const key in dir) {
      const entry = (dir as Record<string, unknown>)[key];
      if (entry && typeof entry === 'object' && 'path' in entry && 'package' in entry) {
        files.push(entry as ParsedFile);
      } else if (entry && typeof entry === 'object') {
        walk(entry as ParsedDirectory);
      }
    }
  };
  walk(root);
  return files;
}

/*** Build per-edge evidence: key "from->to" → list of ImportEvidence. */
function buildEdgeEvidence(dir: ParsedDirectory): Map<string, ImportEvidence[]> {
  const files = collectFiles(dir);
  const map = new Map<string, ImportEvidence[]>();

  for (const f of files) {
    const from = f.package;
    for (const imp of f.imports ?? []) {
      const to = imp.pkg;
      if (!to || to === from) continue;
      const key = `${from}->${to}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push({
        filePath: f.path,
        fileClass: f.className,
        importName: imp.name,
        isIntrinsic: imp.isIntrinsic,
      });
    }
  }
  return map;
}

/*** Convert ElementsDefinition (from buildGraph) to adjacency map. */
function elementsToAdj(elements: ElementsDefinition) {
  const adj = new Map<TUniquePackageName, Set<TUniquePackageName>>();
  for (const n of elements.nodes) {
    const id = String(n.data.id);
    if (!adj.has(id)) adj.set(id, new Set());
  }
  for (const e of elements.edges) {
    const s = String(e.data.source);
    const t = String(e.data.target);
    if (!adj.has(s)) adj.set(s, new Set());
    if (!adj.has(t)) adj.set(t, new Set());
    adj.get(s)!.add(t);
  }
  return adj;
}

/*** Convert adjacency to the canonical Ankhorage graph model for shared algorithms. */
function adjacencyToGraph(
  adjacency: ReadonlyMap<TUniquePackageName, ReadonlySet<TUniquePackageName>>
): Graph<undefined, undefined> {
  return {
    nodes: Array.from(adjacency.keys(), id => ({ id, data: undefined })),
    edges: Array.from(adjacency.entries()).flatMap(([source, targets]) =>
      Array.from(targets, target => ({
        id: `${source}->${target}`,
        source,
        target,
        data: undefined,
      }))
    ),
  };
}

/***
 * High-level API: build graph via `buildGraph`, detect package cycles,
 * and attach **member evidence** (files/imports) per cycle edge.
 */
export function getPackageCyclesWithMembers(
  dir: ParsedDirectory,
  graph: ElementsDefinition
): {
  cycles: PackageCycleDetail[];
  packageSet: Set<TUniquePackageName>;
  graph: ElementsDefinition; // for convenience (already built)
} {
  const adj = elementsToAdj(graph);
  const canonicalGraph = adjacencyToGraph(adj);
  const sccs = findCyclicComponents(canonicalGraph);
  const evidence = buildEdgeEvidence(dir);

  const cycles: PackageCycleDetail[] = [];
  const packageSet = new Set<TUniquePackageName>();

  for (const scc of sccs) {
    scc.forEach(p => packageSet.add(p));
    const cycle = [...(findCyclePath(canonicalGraph, scc) ?? [...scc, scc[0]])];

    const edges: CycleEdgeEvidence[] = [];
    for (let i = 0; i < cycle.length - 1; i++) {
      const from = cycle[i];
      const to = cycle[i + 1];
      const key = `${from}->${to}`;
      edges.push({
        from,
        to,
        via: evidence.get(key) ?? [],
      });
    }

    cycles.push({ packages: cycle, edges });
  }

  return { cycles, packageSet, graph };
}

type TUniquePackageName = string;
