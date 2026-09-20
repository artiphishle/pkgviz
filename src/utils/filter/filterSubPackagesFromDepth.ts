import type { EdgeDefinition, ElementsDefinition } from 'cytoscape';

/***
 * Compute the minimal set of "root" packages that have no ancestor in the list.
 * Example: ['x.y', 'x.y.z', 'a', 'a.c.x'] => ['a', 'x.y']
 */
function findRoots(packages: string[]): string[] {
  const sorted = [...packages].sort(); // parents before children (lexicographically close enough for dotted paths)
  const roots: string[] = [];

  for (const pkg of sorted) {
    if (!roots.some(parent => pkg.startsWith(parent + '.'))) {
      roots.push(pkg);
    }
  }
  return roots;
}

/***
 * Ascend from a package to its nearest ancestor that is in the `roots` set.
 */
function nearestRoot(pkg: string, roots: Set<string>): string {
  if (roots.has(pkg)) return pkg;
  const parts = pkg.split('.');
  while (parts.length > 1) {
    parts.pop();
    const ancestor = parts.join('.');
    if (roots.has(ancestor)) return ancestor;
  }
  // Fallback: if nothing matched (shouldn't happen if roots are computed from the same list)
  return pkg;
}

/***
 * Given a root and a leaf pkg, return the visible ancestor at `maxDepth`
 * under the root, preferring the deepest existing package <= target depth.
 *
 * Example:
 *   root = 'a', pkg = 'a.b.c.d', maxDepth=2 → tries 'a.b' (if exists), else falls back to 'a'
 */
function visibleAncestorForDepth(
  root: string,
  pkg: string,
  maxDepth: number,
  existing: Set<string>
): string {
  // Depth is counted as: root = depth 1; root.child = depth 2; etc.
  if (maxDepth <= 1) return root;

  const rootDepth = root.split('.').length;
  const pkgParts = pkg.split('.');
  const desiredDepth = Math.min(rootDepth + (maxDepth - 1), pkgParts.length);

  // Walk downwards from desiredDepth to rootDepth until we find an existing node
  for (let d = desiredDepth; d >= rootDepth; d--) {
    const candidate = pkgParts.slice(0, d).join('.');
    if (existing.has(candidate)) return candidate;
  }
  return root; // fallback
}

/***
 * Global maximum depth across all roots.
 * Depth is counted relative to the nearest root: root=1, root.child=2, etc.
 */
export function getMaxDepth(elements: ElementsDefinition): number {
  const pkgs = elements.nodes.map(n => String(n.data.id));
  if (pkgs.length === 0) return 0;

  const roots = findRoots(pkgs);
  const rootSet = new Set(roots);

  let maxDepth = 1;
  for (const pkg of pkgs) {
    const root = nearestRoot(pkg, rootSet);
    const depth = pkg.split('.').length - root.split('.').length + 1; // root=1
    if (depth > maxDepth) maxDepth = depth;
  }
  return maxDepth;
}

/***
 * Maximum depth per root, e.g. { 'a': 3, 'x.y': 2 }.
 */
export function getMaxDepthByRoot(elements: ElementsDefinition): Record<string, number> {
  const pkgs = elements.nodes.map(n => String(n.data.id));
  const roots = findRoots(pkgs);
  const rootSet = new Set(roots);

  const result: Record<string, number> = Object.fromEntries(roots.map(r => [r, 1]));
  for (const pkg of pkgs) {
    const root = nearestRoot(pkg, rootSet);
    const depth = pkg.split('.').length - root.split('.').length + 1;
    if (depth > result[root]) result[root] = depth;
  }
  return result;
}

/***
 * Filters sub-packages so only the desired number of levels under each root are shown.
 * @performance Aggregate weights and origin IDs in local maps without repeatedly copying growing
 * evidence arrays. Inputs remain immutable; a large lifted bundle must stay linear in edge count.
 */
export function filterSubPackagesByDepth(
  elements: ElementsDefinition,
  allowSelfLoops = false,
  maxDepth = 1
): ElementsDefinition {
  const allPackages = elements.nodes.map(n => n.data.id!);
  const existingSet = new Set(allPackages);

  // 1) Identify minimal roots (no ancestor present)
  const roots = findRoots(allPackages);
  const rootSet = new Set(roots);

  // 2) Map every package to its visible ancestor according to maxDepth
  const pkgToVisible = new Map<string, string>();
  for (const pkg of allPackages) {
    const root = nearestRoot(pkg, rootSet);
    const visible = visibleAncestorForDepth(root, pkg, maxDepth, existingSet);
    pkgToVisible.set(pkg, visible);
  }

  // 3) Visible nodes = unique set of chosen ancestors
  const visibleNodeIds = new Set<string>(pkgToVisible.values());
  const filteredNodes = elements.nodes.filter(n => visibleNodeIds.has(n.data.id!));

  // 4) Lift & aggregate edges to visible ancestors (sum weights)
  const edgeMap = new Map<string, EdgeDefinition>();
  const edgeOrigins = new Map<string, string[]>();

  for (const e of elements.edges) {
    const rawSource = e.data.source;
    const rawTarget = e.data.target;

    const liftedSource = pkgToVisible.get(rawSource) ?? rawSource;
    const liftedTarget = pkgToVisible.get(rawTarget) ?? rawTarget;

    if (!visibleNodeIds.has(liftedSource) || !visibleNodeIds.has(liftedTarget)) {
      continue;
    }
    if (!allowSelfLoops && liftedSource === liftedTarget) {
      continue;
    }

    const key = `${liftedSource}->${liftedTarget}`;
    const origins = edgeOrigins.get(key) ?? [];
    origins.push(e.data.id ?? `${rawSource}->${rawTarget}`);
    edgeOrigins.set(key, origins);
    if (!edgeMap.has(key)) {
      // clone with lifted endpoints; keep your metadata; (optionally set a stable id)
      edgeMap.set(key, {
        ...e,
        data: {
          ...e.data,
          id: key,
          originalEdgeIds: origins,
          source: liftedSource,
          target: liftedTarget,
          // initialize aggregated weight
          weight: (e.data.weight as number | undefined) ?? 1,
        },
      });
    } else {
      const existing = edgeMap.get(key)!;
      const add = (e.data.weight as number | undefined) ?? 1;
      existing.data.weight = ((existing.data.weight as number | undefined) ?? 0) + add;
    }
  }

  const filteredEdges = Array.from(edgeMap.values());
  return { nodes: filteredNodes, edges: filteredEdges };
}
