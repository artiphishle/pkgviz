import type { ElementsDefinition } from 'cytoscape';

import { findNearestPackageRoot } from '@/features/graph-view/utils/findNearestPackageRoot';
import { findPackageRoots } from '@/features/graph-view/utils/findPackageRoots';
import { readGraphNodeId } from '@/features/graph-view/utils/readGraphNodeId';

/*** Returns the maximum package depth relative to the nearest visible package root. */
export function getMaxDepth(elements: ElementsDefinition): number {
  const packageIds = elements.nodes.flatMap(node => {
    const id = readGraphNodeId(node.data.id);
    return id === null ? [] : [id];
  });
  if (packageIds.length === 0) return 0;

  const roots = new Set(findPackageRoots(packageIds));
  return packageIds.reduce((maxDepth, packageId) => {
    const root = findNearestPackageRoot(packageId, roots);
    const depth = packageId.split('.').length - root.split('.').length + 1;
    return Math.max(maxDepth, depth);
  }, 1);
}
