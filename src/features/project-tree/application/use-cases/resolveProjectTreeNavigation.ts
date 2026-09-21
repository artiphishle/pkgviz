import type { ProjectTreeNode } from '@/types/projectTree';

/*** Resolves tree selection using the same package-descendant rule as graph double-press navigation. */
export function resolveProjectTreeNavigation(
  node: ProjectTreeNode,
  packageIds: readonly string[],
  currentPackage: string
): string {
  const packageId = node.graphPackage.replaceAll('/', '.').replace(/^\.+|\.+$/g, '');
  if (!packageId) return currentPackage;
  const descendantPrefix = packageId + '.';
  return packageIds.some(id => id.startsWith(descendantPrefix)) ? packageId : currentPackage;
}
