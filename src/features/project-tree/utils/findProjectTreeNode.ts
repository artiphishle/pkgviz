import type { ProjectTreeNode } from '@/types/projectTree';

/*** Finds one project-tree node recursively by its stable generated id. */
export function findProjectTreeNode(
  nodes: readonly ProjectTreeNode[],
  id: string
): ProjectTreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    const nested = node.children ? findProjectTreeNode(node.children, id) : null;
    if (nested) return nested;
  }
  return null;
}
