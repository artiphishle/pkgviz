'use client';
import type { ElementsDefinition } from 'cytoscape';
import { useEffect, useMemo } from 'react';

import { projectVisibleGraph } from '@/features/graph-view/utils/projectVisibleGraph';

/*** Projects graph inputs and applies projection-owned package/depth side effects. */
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
