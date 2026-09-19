'use client';
import type { Core, ElementsDefinition } from 'cytoscape';
import { useEffect, useRef } from 'react';

import { useSettings } from '@/contexts/SettingsContext';
import { createCycleFocus } from '@/features/audit/utils/cycleVisualization';
import { getAdaptiveCycleLayoutSpacing } from '@/features/audit/utils/getAdaptiveCycleLayoutSpacing';
import type { CycleHighlight } from '@/types/auditVisualization';
import { applyCycleHighlights } from '@/utils/graph/applyCycleHighlights';
import { fitGraph } from '@/utils/graph/fitGraph';

/*** Keeps active cycles readable while preserving the normal graph projection whenever possible. */
export function useCycleGraphFocus(input: CycleGraphFocusInput) {
  const focusSignatureRef = useRef<string | null>(null);
  const { cytoscapeLayoutSpacing, subPackageDepth, setCytoscapeLayoutSpacing, setSubPackageDepth } =
    useSettings();

  useEffect(() => {
    if (!input.cyInstance || !input.filteredElements || input.cyInstance.destroyed()) return;

    applyCycleHighlights(input.cyInstance, input.cycleHighlights);
    if (input.cycleHighlights.length === 0) {
      focusSignatureRef.current = null;
      return;
    }

    const projectionChanged = ensureCycleProjection({
      cyInstance: input.cyInstance,
      cycleHighlights: input.cycleHighlights,
      currentPackage: input.currentPackage,
      setCurrentPackage: input.setCurrentPackage,
      subPackageDepth,
      setSubPackageDepth,
    });
    if (projectionChanged) return;

    focusCycleViewport({
      cy: input.cyInstance,
      cycleHighlights: input.cycleHighlights,
      currentSpacing: cytoscapeLayoutSpacing,
      focusSignatureRef,
      setCytoscapeLayoutSpacing,
    });
  }, [
    input,
    subPackageDepth,
    cytoscapeLayoutSpacing,
    setCytoscapeLayoutSpacing,
    setSubPackageDepth,
  ]);
}

/*** Ensures the current package projection contains every active cycle package. */
function ensureCycleProjection(input: CycleProjectionInput): boolean {
  const activePackageNames = [
    ...new Set(input.cycleHighlights.flatMap(highlight => highlight.cycle.packages)),
  ];
  const visibleNodeIds = new Set(input.cyInstance.nodes().map(node => node.id()));
  if (activePackageNames.every(packageName => visibleNodeIds.has(packageName))) return false;

  const focus = createCycleFocus(input.cycleHighlights, input.currentPackage);
  if (!focus) return true;

  const normalizedCurrentPackage = input.currentPackage.replace(/\//g, '.');
  const scopeChanged = focus.currentPackage !== normalizedCurrentPackage;
  const depthChanged = focus.packageDepth > input.subPackageDepth;

  if (scopeChanged) input.setCurrentPackage(focus.currentPackage);
  if (depthChanged) input.setSubPackageDepth(focus.packageDepth);
  return true;
}

/*** Fits the whole graph, measures the active cycle, and applies at most one spacing adjustment. */
function focusCycleViewport(input: CycleViewportInput) {
  requestAnimationFrame(() => {
    if (input.cy.destroyed()) return;

    fitGraph(input.cy);
    const signature = input.cycleHighlights
      .map(highlight => highlight.id)
      .sort()
      .join('|');
    if (input.focusSignatureRef.current === signature) return;
    input.focusSignatureRef.current = signature;

    const metrics = getCycleLayoutMetrics(input.cy);
    if (!metrics) return;

    const nextSpacing = getAdaptiveCycleLayoutSpacing(input.currentSpacing, metrics);
    if (nextSpacing < input.currentSpacing) input.setCytoscapeLayoutSpacing(nextSpacing);
  });
}

/*** Measures rendered active-cycle size and spread after the complete graph has been fitted. */
function getCycleLayoutMetrics(cy: Core) {
  const cycleNodes = cy.nodes('.auditCycle');
  const viewportWidth = cy.width();
  const viewportHeight = cy.height();
  if (cycleNodes.empty() || viewportWidth <= 0 || viewportHeight <= 0) return null;

  const cycleBox = cycleNodes.renderedBoundingBox();
  const nodeSizes = cycleNodes.map(node => {
    const nodeBox = node.renderedBoundingBox();
    return Math.min(nodeBox.w, nodeBox.h);
  });
  const positions = cycleNodes.map(node => node.renderedPosition());
  const distances = positions.flatMap((position, index) =>
    positions.slice(index + 1).map(other => Math.hypot(position.x - other.x, position.y - other.y))
  );

  return {
    viewportWidth,
    viewportHeight,
    cycleWidth: cycleBox.w,
    cycleHeight: cycleBox.h,
    averageNodeSize: nodeSizes.reduce((sum, size) => sum + size, 0) / nodeSizes.length,
    averageNodeDistance:
      distances.length === 0
        ? 0
        : distances.reduce((sum, distance) => sum + distance, 0) / distances.length,
  };
}

interface CycleGraphFocusInput {
  readonly cyInstance: Core | null;
  readonly filteredElements: ElementsDefinition | null;
  readonly cycleHighlights: readonly CycleHighlight[];
  readonly currentPackage: string;
  readonly setCurrentPackage: (path: string) => void;
}

interface CycleProjectionInput extends Omit<
  CycleGraphFocusInput,
  'cyInstance' | 'filteredElements'
> {
  readonly cyInstance: Core;
  readonly subPackageDepth: number;
  readonly setSubPackageDepth: (depth: number) => void;
}

interface CycleViewportInput {
  readonly cy: Core;
  readonly cycleHighlights: readonly CycleHighlight[];
  readonly currentSpacing: number;
  readonly focusSignatureRef: { current: string | null };
  readonly setCytoscapeLayoutSpacing: (spacing: number) => void;
}
