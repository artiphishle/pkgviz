import type { ElementsDefinition } from 'cytoscape';
import type { IDirectory, IFile } from '@/app/api/fs/types/index';

/** Collect all files from your IDirectory tree. */
function collectFiles(root: IDirectory): IFile[] {
  const files: IFile[] = [];
  const walk = (dir: IDirectory) => {
    for (const key in dir) {
      const entry = (dir as Record<string, unknown>)[key];
      if (entry && typeof entry === 'object' && 'path' in entry && 'package' in entry) {
        files.push(entry as IFile);
      } else if (entry && typeof entry === 'object') {
        walk(entry as IDirectory);
      }
    }
  };
  walk(root);
  return files;
}

/** Build per-edge evidence: key "from->to" → list of ImportEvidence. */
function buildEdgeEvidence(dir: IDirectory): Map<string, ImportEvidence[]> {
  const files = collectFiles(dir);
  const map = new Map<string, ImportEvidence[]>();

  for (const f of files) {
    const from = f.package as TUniquePackageName;
    for (const imp of f.imports ?? []) {
      const to = imp.pkg as TUniquePackageName;
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

/** Convert ElementsDefinition (from buildGraph) to adjacency map. */
function elementsToAdj(elements: ElementsDefinition) {
  const adj = new Map<TUniquePackageName, Set<TUniquePackageName>>();
  for (const n of elements.nodes) {
    const id = String(n.data.id) as TUniquePackageName;
    if (!adj.has(id)) adj.set(id, new Set());
  }
  for (const e of elements.edges) {
    const s = String(e.data.source) as TUniquePackageName;
    const t = String(e.data.target) as TUniquePackageName;
    if (!adj.has(s)) adj.set(s, new Set());
    if (!adj.has(t)) adj.set(t, new Set());
    adj.get(s)!.add(t);
  }
  return adj;
}

/** Tarjan SCC on adjacency. */
function tarjanSCC(
  graph: Map<TUniquePackageName, Set<TUniquePackageName>>
): TUniquePackageName[][] {
  let index = 0;
  const idx = new Map<TUniquePackageName, number>();
  const low = new Map<TUniquePackageName, number>();
  const stack: TUniquePackageName[] = [];
  const onStack = new Set<TUniquePackageName>();
  const out: TUniquePackageName[][] = [];

  function strong(v: TUniquePackageName) {
    idx.set(v, index);
    low.set(v, index);
    index++;
    stack.push(v);
    onStack.add(v);

    for (const w of graph.get(v) ?? []) {
      if (!idx.has(w)) {
        strong(w);
        low.set(v, Math.min(low.get(v)!, low.get(w)!));
      } else if (onStack.has(w)) {
        low.set(v, Math.min(low.get(v)!, idx.get(w)!));
      }
    }

    if (low.get(v) === idx.get(v)) {
      const comp: TUniquePackageName[] = [];
      let w: TUniquePackageName;
      do {
        w = stack.pop()!;
        onStack.delete(w);
        comp.push(w);
      } while (w !== v);
      out.push(comp);
    }
  }

  for (const v of graph.keys()) if (!idx.has(v)) strong(v);
  return out;
}

/** Find one simple cycle ordering inside a given SCC. */
function findOneCycleInScc(
  graph: Map<TUniquePackageName, Set<TUniquePackageName>>,
  sccSet: Set<TUniquePackageName>
): TUniquePackageName[] | null {
  const nodes = Array.from(sccSet);
  for (const start of nodes) {
    const path: TUniquePackageName[] = [];
    const seen = new Set<TUniquePackageName>();
    function dfs(v: TUniquePackageName): TUniquePackageName[] | null {
      path.push(v);
      seen.add(v);
      for (const w of graph.get(v) ?? []) {
        if (!sccSet.has(w)) continue;
        if (w === start && path.length > 1) return [...path, start];
        if (!seen.has(w)) {
          const r = dfs(w);
          if (r) return r;
        }
      }
      path.pop();
      return null;
    }
    const cyc = dfs(start);
    if (cyc) return cyc;
  }
  return null;
}

/**
 * High-level API: build graph via `buildGraph`, detect package cycles,
 * and attach **member evidence** (files/imports) per cycle edge.
 */
export function getPackageCyclesWithMembers(
  dir: IDirectory,
  graph: ElementsDefinition
): {
  cycles: PackageCycleDetail[];
  packageSet: Set<TUniquePackageName>;
  graph: ElementsDefinition; // for convenience (already built)
} {
  const adj = elementsToAdj(graph);
  const sccs = tarjanSCC(adj);
  const evidence = buildEdgeEvidence(dir);

  const cycles: PackageCycleDetail[] = [];
  const packageSet = new Set<TUniquePackageName>();

  for (const scc of sccs) {
    const selfLoop = scc.length === 1 && (adj.get(scc[0])?.has(scc[0]) ?? false);
    if (scc.length > 1 || selfLoop) {
      scc.forEach(p => packageSet.add(p));
      const sccSet = new Set(scc);
      const cycle = findOneCycleInScc(adj, sccSet) ?? [...scc, scc[0]];

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
  }

  return { cycles, packageSet, graph };
}

/**
 * Annotate Cytoscape nodes:
 *  - adds class "packageCycle" for cyclic packages
 *  - sets data.packageCycle (boolean)
 *  - sets data.cycleEvidence (edges where this pkg is the "from" side)
 */
export function markCyclicPackagesWithEvidence(
  elements: ElementsDefinition,
  dir: IDirectory
): ElementsDefinition {
  const { cycles, packageSet } = getPackageCyclesWithMembers(dir, elements);

  // pkg → list of outgoing cycle edges (evidence)
  const pkgToEdges = new Map<TUniquePackageName, CycleEdgeEvidence[]>();

  // Track cycle edges by (from → to) for quick lookup when mapping Cytoscape edges
  const cycleEdgeKeys = new Set<string>();

  for (const c of cycles) {
    for (const e of c.edges) {
      if (!pkgToEdges.has(e.from)) pkgToEdges.set(e.from, []);
      pkgToEdges.get(e.from)!.push(e);
      cycleEdgeKeys.add(`${e.from}→${e.to}`);
    }
  }

  const nodes = (elements.nodes ?? []).map(n => {
    const id = String(n.data.id) as TUniquePackageName;
    const isCyclic = packageSet.has(id);
    const existing = n.classes ? String(n.classes) : '';
    const classes = isCyclic ? (existing ? `${existing} packageCycle` : 'packageCycle') : existing;

    return {
      ...n,
      classes,
      data: {
        ...n.data,
        packageCycle: isCyclic,
        cycleEvidence: isCyclic ? (pkgToEdges.get(id) ?? []) : undefined,
      },
    };
  });

  const edges = (elements.edges ?? []).map(e => {
    const source = String(e.data.source) as TUniquePackageName;
    const target = String(e.data.target) as TUniquePackageName;
    const isCycleEdge = cycleEdgeKeys.has(`${source}→${target}`);

    const existing = e.classes ? String(e.classes) : '';
    const classes = isCycleEdge
      ? existing
        ? `${existing} packageCycle`
        : 'packageCycle'
      : existing;

    return {
      ...e,
      classes,
      data: {
        ...e.data,
        packageCycle: isCycleEdge,
      },
    };
  });

  return { ...elements, nodes, edges };
}

/**
 * Convenience that only returns the set of cyclic packages (no evidence)
 */
export function getCyclicPackageSet(
  dir: IDirectory,
  graph: ElementsDefinition
): Set<TUniquePackageName> {
  const { packageSet } = getPackageCyclesWithMembers(dir, graph);
  return packageSet;
}

type TUniquePackageName = string;

interface ImportEvidence {
  readonly filePath: string; // IFile.path (relative to project)
  readonly fileClass: string; // IFile.className
  readonly importName: string; // IJavaImport.name
  readonly isIntrinsic?: boolean; // IJavaImport.isIntrinsic
}

interface CycleEdgeEvidence {
  readonly from: TUniquePackageName;
  readonly to: TUniquePackageName;
  readonly via: ImportEvidence[]; // files in `from` that import `to`
}

export interface PackageCycleDetail {
  readonly packages: TUniquePackageName[]; // ordered cycle incl. closing node, e.g. ["A","B","A"]
  readonly edges: CycleEdgeEvidence[]; // evidence aligned with packages[i] -> packages[i+1]
}
