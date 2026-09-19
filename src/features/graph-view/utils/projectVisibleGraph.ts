import type { ElementsDefinition } from 'cytoscape';

import { filterByPackagePrefix } from '@/utils/filter/filterByPackagePrefix';
import { filterEmptyPackages } from '@/utils/filter/filterEmptyPackages';
import { filterSubPackagesByDepth, getMaxDepth } from '@/utils/filter/filterSubPackagesFromDepth';
import { filterVendorPackages } from '@/utils/filter/filterVendorPackages';
import { toggleCompoundNodes } from '@/utils/filter/toggleCompoundNodes';

/*** Projects the complete dependency graph into the explicitly selected package/depth/filter view. */
export function projectVisibleGraph(input: ProjectVisibleGraphInput): ProjectVisibleGraphResult {
  const compoundFiltered = toggleCompoundNodes(
    input.elements,
    input.showCompoundNodes,
    input.currentPackage
  );
  const packageFiltered = filterByPackagePrefix(
    compoundFiltered,
    input.currentPackage.replace(/\//g, '.')
  );
  const depthFiltered = filterSubPackagesByDepth(packageFiltered, true, input.subPackageDepth);
  const visible = input.showVendorPackages ? depthFiltered : filterVendorPackages(depthFiltered);

  return {
    elements: labelVisibleNodes(visible, input.currentPackage),
    maxSubPackageDepth: getMaxDepth(input.elements),
    redirectPackage: resolveRedirectPackage(input, visible),
  };
}

interface ProjectVisibleGraphInput {
  readonly currentPackage: string;
  readonly elements: ElementsDefinition;
  readonly revealPackageId?: string;
  readonly showCompoundNodes: boolean;
  readonly showVendorPackages: boolean;
  readonly subPackageDepth: number;
}

interface ProjectVisibleGraphResult {
  readonly elements: ElementsDefinition;
  readonly maxSubPackageDepth: number;
  readonly redirectPackage: string | null;
}

/*** Skips package levels that contain no branching point while preserving explicit reveal targets. */
function resolveRedirectPackage(
  input: ProjectVisibleGraphInput,
  visible: ElementsDefinition
): string | null {
  const currentPackage = input.currentPackage.replaceAll('/', '.');
  const revealParent = input.revealPackageId?.split('.').slice(0, -1).join('.') ?? null;
  if (revealParent === currentPackage) return null;

  const nextPackage = filterEmptyPackages(currentPackage, visible);
  return nextPackage === currentPackage ? null : nextPackage;
}

/*** Adds package-relative display labels without changing graph ids. */
function labelVisibleNodes(
  elements: ElementsDefinition,
  currentPackage: string
): ElementsDefinition {
  const normalizedPackage = currentPackage.replaceAll('/', '.');

  return {
    nodes: elements.nodes.map(node => ({
      group: 'nodes',
      classes: node.classes ?? '',
      data: {
        ...node.data,
        label: getRelativeNodeLabel(String(node.data.id ?? ''), normalizedPackage),
      },
    })),
    edges: elements.edges,
  };
}

/*** Resolves a readable label for the active package itself and for its descendants. */
function getRelativeNodeLabel(id: string, currentPackage: string): string {
  if (!currentPackage) return id;
  if (id === currentPackage) return id.split('.').at(-1) ?? id;
  const descendantPrefix = currentPackage + '.';
  return id.startsWith(descendantPrefix) ? id.slice(descendantPrefix.length) : id;
}
