'use client';
import type { ElementsDefinition } from 'cytoscape';
import { useEffect, useMemo } from 'react';

import { projectVisibleGraph } from '@/features/graph-view/utils/projectVisibleGraph';

/***
 * Projects graph inputs without changing the explicitly selected package scope.
 * @performance
 * Package/depth/vendor projection traverses nodes and aggregates edges. Keep it memoized on its
 * actual inputs so unrelated UI renders do not repeat that work or replace the visible graph data.
 * Preserve lifted-edge weights and reveal semantics when optimizing; projectVisibleGraph tests
 * cover those behaviors. Do not add a second independently maintained projection state.
 */
export function useGraphProjection(input: UseGraphProjectionInput): ElementsDefinition | null {
  const {
    currentPackage,
    elements,
    revealPackageId,
    setCurrentPackage,
    setMaxSubPackageDepth,
    showCompoundNodes,
    showVendorPackages,
    subPackageDepth,
  } = input;
  const projection = useMemo(
    () =>
      elements === null
        ? null
        : projectVisibleGraph({
            currentPackage,
            elements,
            revealPackageId,
            showCompoundNodes,
            showVendorPackages,
            subPackageDepth,
          }),
    [
      currentPackage,
      elements,
      revealPackageId,
      showCompoundNodes,
      showVendorPackages,
      subPackageDepth,
    ]
  );

  useEffect(() => {
    if (projection === null) return;
    setMaxSubPackageDepth(projection.maxSubPackageDepth);
    if (projection.redirectPackage !== null) setCurrentPackage(projection.redirectPackage);
  }, [projection, setCurrentPackage, setMaxSubPackageDepth]);

  return projection?.redirectPackage === null ? projection.elements : null;
}

interface UseGraphProjectionInput {
  readonly currentPackage: string;
  readonly elements: ElementsDefinition | null;
  readonly revealPackageId?: string;
  readonly setCurrentPackage: (path: string) => void;
  readonly setMaxSubPackageDepth: (depth: number) => void;
  readonly showCompoundNodes: boolean;
  readonly showVendorPackages: boolean;
  readonly subPackageDepth: number;
}
