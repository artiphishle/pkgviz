import type { ProjectTreeNode } from '@/types/projectTree';

/*** Finds the deepest directory representing a graph package, falling back to a matching file. */
export function findProjectTreeNodeByGraphPackage(
  nodes: readonly ProjectTreeNode[],
  graphPackage: string
): ProjectTreeNode | null {
  const matches = collectProjectTreePackageMatches(nodes, graphPackage);
  return matches.find(node => node.kind === 'directory') ?? matches.at(0) ?? null;
}

/*** Collects package matches depth-first so nested directories outrank their ancestors. */
function collectProjectTreePackageMatches(
  nodes: readonly ProjectTreeNode[],
  graphPackage: string
): readonly ProjectTreeNode[] {
  return nodes.flatMap(node => [
    ...(node.children ? collectProjectTreePackageMatches(node.children, graphPackage) : []),
    ...(node.graphPackage === graphPackage ? [node] : []),
  ]);
}
