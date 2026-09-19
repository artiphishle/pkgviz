'use client';
import type { ElementsDefinition } from 'cytoscape';

import { useSettings } from '@/contexts/SettingsContext';
import { useCytoscapeInstance } from '@/features/graph-view/adapters/inbound/react/useCytoscapeInstance';
import { useGraphElements } from '@/features/graph-view/adapters/inbound/react/useGraphElements';
import { useGraphFocus } from '@/features/graph-view/adapters/inbound/react/useGraphFocus';
import { useGraphInteractions } from '@/features/graph-view/adapters/inbound/react/useGraphInteractions';
import { useGraphLayout } from '@/features/graph-view/adapters/inbound/react/useGraphLayout';
import { useGraphProjection } from '@/features/graph-view/adapters/inbound/react/useGraphProjection';
import { useGraphStyles } from '@/features/graph-view/adapters/inbound/react/useGraphStyles';
import { useGraphViewport } from '@/features/graph-view/adapters/inbound/react/useGraphViewport';
import type { CycleHighlight } from '@/types/auditVisualization';
import type { GraphRevealRequest } from '@/types/projectTree';

/*** Composes the focused graph adapters that own projection, runtime, layout, focus, and events. */
export function useCytoscape(
  elements: ElementsDefinition | null,
  currentPackage: string,
  setCurrentPackage: (path: string) => void,
  cycleHighlights: readonly CycleHighlight[],
  graphRevealRequest: GraphRevealRequest | null
) {
  const settings = useSettings();
  const revealPackageId = cycleHighlights.length > 0 ? undefined : graphRevealRequest?.packageId;
  const visibleElements = useGraphProjection({
    currentPackage,
    elements,
    setMaxSubPackageDepth: settings.setMaxSubPackageDepth,
    showCompoundNodes: settings.showCompoundNodes,
    showVendorPackages: settings.showVendorPackages,
    subPackageDepth: settings.subPackageDepth,
  });
  const { cyRef, cyInstance } = useCytoscapeInstance();

  useGraphElements({ allElements: elements, cy: cyInstance, setCurrentPackage, visibleElements });
  const { layoutRunningRef, settledRevision } = useGraphLayout({
    cy: cyInstance,
    elements: visibleElements,
    layout: settings.cytoscapeLayout,
    spacing: settings.cytoscapeLayoutSpacing,
  });
  useGraphFocus({
    cy: cyInstance,
    cycleHighlights,
    currentPackage,
    setCurrentPackage,
    setSubPackageDepth: settings.setSubPackageDepth,
    subPackageDepth: settings.subPackageDepth,
    visibleElements,
  });
  useGraphViewport({
    cy: cyInstance,
    cycleHighlights,
    layoutRunningRef,
    revealPackageId,
    setCytoscapeLayoutSpacing: settings.setCytoscapeLayoutSpacing,
    settledRevision,
    spacing: settings.cytoscapeLayoutSpacing,
    visibleElements,
  });
  useGraphStyles({ cy: cyInstance, layout: settings.cytoscapeLayout, visibleElements });
  useGraphInteractions({ allElements: elements, cy: cyInstance, visibleElements });
  return { cyRef, cyInstance };
}
