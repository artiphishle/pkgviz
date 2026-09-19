'use client';
import type { ElementsDefinition } from 'cytoscape';
import { useEffect, useMemo } from 'react';

import { projectVisibleGraph } from '@/features/graph-view/utils/projectVisibleGraph';

/*** Projects graph inputs without changing the explicitly selected package scope. */
export function useGraphProjection(input: UseGraphProjectionInput): ElementsDefinition | null {
  const {
    currentPackage,
    elements,
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
            showCompoundNodes,
            showVendorPackages,
            subPackageDepth,
          }),
    [currentPackage, elements, showCompoundNodes, showVendorPackages, subPackageDepth]
  );

  useEffect(() => {
    if (projection === null) return;
    setMaxSubPackageDepth(projection.maxSubPackageDepth);
  }, [projection, setMaxSubPackageDepth]);

  return projection?.elements ?? null;
}

interface UseGraphProjectionInput {
  readonly currentPackage: string;
  readonly elements: ElementsDefinition | null;
  readonly setMaxSubPackageDepth: (depth: number) => void;
  readonly showCompoundNodes: boolean;
  readonly showVendorPackages: boolean;
  readonly subPackageDepth: number;
}
