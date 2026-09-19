import type { ProjectTreeNode } from '@/types/projectTree';

/*** Returns every directory id that must be expanded to reveal one tree node. */
export function getProjectTreeAncestorIds(
  nodes: readonly ProjectTreeNode[],
  targetId: string
): readonly string[] {
  return findProjectTreeAncestorIds(nodes, targetId, []) ?? [];
}

/*** Finds one target recursively while carrying its directory ancestry. */
function findProjectTreeAncestorIds(
  nodes: readonly ProjectTreeNode[],
  targetId: string,
  ancestors: readonly string[]
): readonly string[] | null {
  for (const node of nodes) {
    if (node.id === targetId) return ancestors;
    if (!node.children) continue;

    const match = findProjectTreeAncestorIds(node.children, targetId, [...ancestors, node.id]);
    if (match !== null) return match;
  }

  return null;
}
