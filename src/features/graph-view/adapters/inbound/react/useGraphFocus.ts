'use client';
import type { Core, ElementsDefinition } from 'cytoscape';
import { useEffect, useRef } from 'react';

import { createCycleFocus } from '@/features/audit/utils/cycleVisualization';
import { getAdaptiveCycleLayoutSpacing } from '@/features/audit/utils/getAdaptiveCycleLayoutSpacing';
import type { CycleHighlight } from '@/types/auditVisualization';
import { applyCycleHighlights } from '@/utils/graph/applyCycleHighlights';
import { fitGraph } from '@/utils/graph/fitGraph';
import { fitGraphViewport, revealGraphPackage } from '@/utils/graph/fitGraphViewport';

/*** Owns cycle highlighting, adaptive cycle focus, tree reveal focus, and resize fitting. */
export function useGraphFocus(input: UseGraphFocusInput) {
  const focusSignatureRef = useRef<string | null>(null);
  const {
    cy,
    cycleHighlights,
    currentPackage,
    revealPackageId,
    setCurrentPackage,
    setCytoscapeLayoutSpacing,
    setSubPackageDepth,
    spacing,
    subPackageDepth,
    visibleElements,
  } = input;

  useEffect(() => {
    if (cy === null || visibleElements === null || cy.destroyed()) return;
    applyCycleHighlights(cy, cycleHighlights);
    if (cycleHighlights.length === 0) {
      focusSignatureRef.current = null;
      return;
    }
    if (ensureCycleProjection(input)) return;
    const frame = requestAnimationFrame(() =>
      focusCycleViewport(input, focusSignatureRef)
    );
    return () => cancelAnimationFrame(frame);
  }, [
    cy,
    cycleHighlights,
    currentPackage,
    setCurrentPackage,
    setCytoscapeLayoutSpacing,
    setSubPackageDepth,
    spacing,
    subPackageDepth,
    visibleElements,
  ]);

  useEffect(() => {
    if (
      cy === null ||
      visibleElements === null ||
      revealPackageId === undefined ||
      cycleHighlights.length > 0 ||
      cy.destroyed()
    ) {
      return;
    }
    revealGraphPackage(cy, revealPackageId);
  }, [cy, cycleHighlights, revealPackageId, visibleElements]);

  useEffect(() => observeGraphResize(cy, revealPackageId), [cy, revealPackageId]);
}

/*** Expands only the projection dimensions required to expose every active cycle package. */
function ensureCycleProjection(input: UseGraphFocusInput): boolean {
  if (input.cy === null) return true;
  const activePackageNames = [
    ...new Set(input.cycleHighlights.flatMap(highlight => highlight.cycle.packages)),
  ];
  const visibleNodeIds = new Set(input.cy.nodes().map(node => node.id()));
  if (activePackageNames.every(packageName => visibleNodeIds.has(packageName))) return false;

  const focus = createCycleFocus(input.cycleHighlights, input.currentPackage);
  if (!focus) return true;
  const normalizedCurrentPackage = input.currentPackage.replace(/\//g, '.');

  if (focus.currentPackage !== normalizedCurrentPackage) {
    input.setCurrentPackage(focus.currentPackage);
  }
  if (focus.packageDepth > input.subPackageDepth) {
    input.setSubPackageDepth(focus.packageDepth);
  }
  return true;
}

/*** Fits the whole graph, measures the cycle, and applies at most one spacing reduction. */
function focusCycleViewport(
  input: UseGraphFocusInput,
  signatureRef: { current: string | null }
) {
  if (input.cy === null || input.cy.destroyed()) return;
  fitGraph(input.cy);

  const signature = input.cycleHighlights
    .map(highlight => highlight.id)
    .sort()
    .join('|');
  if (signatureRef.current === signature) return;
  signatureRef.current = signature;

  const metrics = getCycleLayoutMetrics(input.cy);
  if (!metrics) return;
  const nextSpacing = getAdaptiveCycleLayoutSpacing(input.spacing, metrics);
  if (nextSpacing < input.spacing) input.setCytoscapeLayoutSpacing(nextSpacing);
}

/*** Measures rendered cycle size and spread after the complete graph has been fitted. */
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
    positions.slice(index + 1).map(other =>
      Math.hypot(position.x - other.x, position.y - other.y)
    )
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

/*** Observes graph resizing and reapplies the current non-cycle viewport focus policy. */
function observeGraphResize(cy: Core | null, revealPackageId?: string) {
  if (cy === null || cy.destroyed()) return undefined;
  const container = cy.container();
  if (container === null) return undefined;

  const observer = new ResizeObserver(() => {
    requestAnimationFrame(() => fitGraphViewport(cy, revealPackageId));
  });
  observer.observe(container);
  return () => observer.disconnect();
}

interface UseGraphFocusInput {
  readonly cy: Core | null;
  readonly cycleHighlights: readonly CycleHighlight[];
  readonly currentPackage: string;
  readonly revealPackageId?: string;
  readonly setCurrentPackage: (path: string) => void;
  readonly setCytoscapeLayoutSpacing: (spacing: number) => void;
  readonly setSubPackageDepth: (depth: number) => void;
  readonly spacing: number;
  readonly subPackageDepth: number;
  readonly visibleElements: ElementsDefinition | null;
}
