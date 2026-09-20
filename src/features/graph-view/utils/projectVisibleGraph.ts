import type { ElementsDefinition } from 'cytoscape';

import { removeEmptyStructuralNodes } from '@/features/graph-view/utils/removeEmptyStructuralNodes';
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
    elements: labelVisibleNodes(
      input.showCompoundNodes ? visible : removeEmptyStructuralNodes(visible),
      input.currentPackage
    ),
    maxSubPackageDepth: getMaxDepth(input.elements),
    redirectPackage: resolveRedirectPackage(input),
  };
}

interface ProjectVisibleGraphInput {
  readonly currentPackage: string;
  readonly elements: ElementsDefinition;
  readonly preservePackageScope?: boolean;
  readonly showCompoundNodes: boolean;
  readonly showVendorPackages: boolean;
  readonly subPackageDepth: number;
}

interface ProjectVisibleGraphResult {
  readonly elements: ElementsDefinition;
  readonly maxSubPackageDepth: number;
  readonly redirectPackage: string | null;
}

/***
 * Skips empty package levels only when no explicit cycle scope owns the projection.
 * @performance
 * An active cycle can require an ancestor package as a visible node. Redirecting into that package
 * hides it again and causes an endless focus/redirect loop, repeatedly remounting the renderer.
 */
function resolveRedirectPackage(input: ProjectVisibleGraphInput): string | null {
  const currentPackage = input.currentPackage.replaceAll('/', '.');
  if (input.preservePackageScope) return null;

  const nextPackage = filterEmptyPackages(currentPackage, input.elements);
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
