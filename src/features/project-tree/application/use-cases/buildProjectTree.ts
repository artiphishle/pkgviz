import type { ParsedDirectory, ParsedFile } from '@/shared/types';
import type { ProjectTreeNode } from '@/types/projectTree';

/*** Converts parsed-project data into the serializable hierarchy consumed by the sidebar. */
export function buildProjectTree(
  directory: ParsedDirectory,
  parentPath = ''
): readonly ProjectTreeNode[] {
  return Object.entries(directory)
    .sort(compareEntries)
    .map(([name, value]) => {
      const itemPath = parentPath ? `${parentPath}/${name}` : name;
      if (isParsedFile(value)) {
        return {
          graphPackage: value.package,
          id: `file:${itemPath}`,
          kind: 'file' as const,
          label: name,
        };
      }

      return {
        children: buildProjectTree(value, itemPath),
        graphPackage: itemPath.replaceAll('/', '.'),
        id: `directory:${itemPath}`,
        kind: 'directory' as const,
        label: name,
      };
    });
}

/*** Sorts folders before files while keeping each group alphabetic. */
function compareEntries(
  [leftName, left]: [string, ParsedDirectory | ParsedFile],
  [rightName, right]: [string, ParsedDirectory | ParsedFile]
) {
  const kindDelta = Number(isParsedFile(left)) - Number(isParsedFile(right));
  return kindDelta || leftName.localeCompare(rightName);
}

/*** Distinguishes parsed files from recursive directory records without relying on class names. */
function isParsedFile(value: ParsedDirectory | ParsedFile): value is ParsedFile {
  return 'path' in value && typeof value.path === 'string' && 'package' in value;
}
