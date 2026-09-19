import type { ElementsDefinition } from 'cytoscape';

import { filterByPackagePrefix } from '@/utils/filter/filterByPackagePrefix';
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
  };
}

interface ProjectVisibleGraphInput {
  readonly currentPackage: string;
  readonly elements: ElementsDefinition;
  readonly showCompoundNodes: boolean;
  readonly showVendorPackages: boolean;
  readonly subPackageDepth: number;
}

interface ProjectVisibleGraphResult {
  readonly elements: ElementsDefinition;
  readonly maxSubPackageDepth: number;
}

/*** Adds package-relative display labels without changing graph ids. */
function labelVisibleNodes(
  elements: ElementsDefinition,
  currentPackage: string
): ElementsDefinition {
  return {
    nodes: elements.nodes.map(node => ({
      group: 'nodes',
      classes: node.classes ?? '',
      data: {
        ...node.data,
        label: currentPackage.length
          ? node.data.id?.slice(currentPackage.length + 1)
          : node.data.id,
      },
    })),
    edges: elements.edges,
  };
}
