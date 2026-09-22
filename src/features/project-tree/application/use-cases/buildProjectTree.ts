import type { ProjectFileMetadata, ProjectFileTree } from '@/types/projectFiles';
import type { ProjectTreeNode } from '@/types/projectTree';

/*** Converts project file metadata into the serializable hierarchy consumed by the sidebar. */
export function buildProjectTree(
  directory: ProjectFileTree,
  parentPath = ''
): readonly ProjectTreeNode[] {
  return Object.entries(directory)
    .sort(compareEntries)
    .map(([name, value]) => {
      const itemPath = parentPath ? `${parentPath}/${name}` : name;
      if (isProjectFileMetadata(value)) {
        return {
          graphPackage: value.package,
          id: `file:${itemPath}`,
          kind: 'file' as const,
          label: name,
        };
      }

      const children = buildProjectTree(value, itemPath);
      return {
        children,
        graphPackage: getCommonGraphPackage(children),
        id: `directory:${itemPath}`,
        kind: 'directory' as const,
        label: name,
      };
    });
}

/*** Sorts folders before files while keeping each group alphabetic. */
function compareEntries(
  [leftName, left]: [string, ProjectFileTree | ProjectFileMetadata],
  [rightName, right]: [string, ProjectFileTree | ProjectFileMetadata]
) {
  const kindDelta = Number(isProjectFileMetadata(left)) - Number(isProjectFileMetadata(right));
  return kindDelta || leftName.localeCompare(rightName);
}

/*** Derives the graph package represented by a filesystem directory from its descendants. */
function getCommonGraphPackage(children: readonly ProjectTreeNode[]): string {
  const packages = children
    .map(child => child.graphPackage)
    .filter(packageName => packageName.length);
  const [firstPackage, ...remainingPackages] = packages;
  if (!firstPackage) return '';

  const firstSegments = firstPackage.split('.');
  const mismatchIndex = firstSegments.findIndex((segment, index) =>
    remainingPackages.some(packageName => packageName.split('.').at(index) !== segment)
  );
  const commonLength = mismatchIndex === -1 ? firstSegments.length : mismatchIndex;
  return firstSegments.slice(0, commonLength).join('.');
}

/*** Distinguishes project file metadata from recursive directory records without relying on class names. */
function isProjectFileMetadata(
  value: ProjectFileTree | ProjectFileMetadata
): value is ProjectFileMetadata {
  return 'path' in value && typeof value.path === 'string' && 'package' in value;
}
