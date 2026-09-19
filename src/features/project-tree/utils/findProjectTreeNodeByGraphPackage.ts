import type { ProjectTreeNode } from '@/types/projectTree';

/*** Finds the deepest project-tree node representing the requested graph package. */
export function findProjectTreeNodeByGraphPackage(
  nodes: readonly ProjectTreeNode[],
  graphPackage: string
): ProjectTreeNode | null {
  return nodes.reduce<ProjectTreeNode | null>((match, node) => {
    const nestedMatch = node.children
      ? findProjectTreeNodeByGraphPackage(node.children, graphPackage)
      : null;
    if (nestedMatch) return nestedMatch;
    if (node.graphPackage !== graphPackage) return match;
    if (match === null || node.kind === 'directory') return node;
    return match;
  }, null);
}
