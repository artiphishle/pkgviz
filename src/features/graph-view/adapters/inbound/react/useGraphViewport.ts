'use client';
import type { Core, ElementsDefinition } from 'cytoscape';
import { useEffect, useRef } from 'react';

import { getAdaptiveCycleLayoutSpacing } from '@/features/audit/utils/getAdaptiveCycleLayoutSpacing';
import type { CycleHighlight } from '@/types/auditVisualization';
import { fitGraph } from '@/utils/graph/fitGraph';
import { fitGraphViewport } from '@/utils/graph/fitGraphViewport';

/*** Owns all automatic viewport fitting after layouts have settled. */
export function useGraphViewport(input: UseGraphViewportInput) {
  const adaptedCycleSignatureRef = useRef<string | null>(null);
  useSettledViewportFit(input, adaptedCycleSignatureRef);
  useViewportResize(input);
}

/*** Fits the current settled graph exactly once per relevant viewport state change. */
function useSettledViewportFit(
  input: UseGraphViewportInput,
  adaptedCycleSignatureRef: { current: string | null }
) {
  const {
    cy,
    cycleHighlights,
    layoutRunningRef,
    revealPackageId,
    setCytoscapeLayoutSpacing,
    settledRevision,
    spacing,
    visibleElements,
  } = input;

  useEffect(() => {
    if (
      cy === null ||
      visibleElements === null ||
      layoutRunningRef.current ||
      cy.destroyed()
    ) {
      return;
    }

    const frame = requestAnimationFrame(() =>
      applySettledViewportFocus(
        {
          cy,
          cycleHighlights,
          layoutRunningRef,
          revealPackageId,
          setCytoscapeLayoutSpacing,
          spacing,
        },
        adaptedCycleSignatureRef
      )
    );
    return () => cancelAnimationFrame(frame);
  }, [
    adaptedCycleSignatureRef,
    cy,
    cycleHighlights,
    layoutRunningRef,
    revealPackageId,
    setCytoscapeLayoutSpacing,
    settledRevision,
    spacing,
    visibleElements,
  ]);
}

/*** Applies the canonical automatic fit and at most one cycle-spacing adjustment. */
function applySettledViewportFocus(
  input: SettledViewportInput,
  adaptedCycleSignatureRef: { current: string | null }
) {
  if (input.cy.destroyed() || input.layoutRunningRef.current) return;
  input.cy.resize();

  if (input.cycleHighlights.length === 0) {
    adaptedCycleSignatureRef.current = null;
    fitGraphViewport(input.cy, input.revealPackageId);
    return;
  }

  fitGraph(input.cy);
  if (!containsAllCycleNodes(input.cy, input.cycleHighlights)) return;

  const signature = getCycleSignature(input.cycleHighlights);
  if (adaptedCycleSignatureRef.current === signature) return;
  adaptedCycleSignatureRef.current = signature;

  const metrics = getCycleLayoutMetrics(input.cy);
  if (!metrics) return;
  const nextSpacing = getAdaptiveCycleLayoutSpacing(input.spacing, metrics);
  if (nextSpacing < input.spacing) input.setCytoscapeLayoutSpacing(nextSpacing);
}

/*** Refits the already-settled graph after genuine container size changes. */
function useViewportResize(input: UseGraphViewportInput) {
  const { cy, cycleHighlights, layoutRunningRef, revealPackageId, visibleElements } = input;

  useEffect(
    () =>
      observeViewportResize({
        cy,
        cycleHighlights,
        layoutRunningRef,
        revealPackageId,
        visibleElements,
      }),
    [cy, cycleHighlights, layoutRunningRef, revealPackageId, visibleElements]
  );
}

/*** Observes container resizing without fitting unfinished layouts. */
function observeViewportResize(input: ResizeViewportInput) {
  const { cy, visibleElements } = input;
  if (cy === null || visibleElements === null || cy.destroyed()) return undefined;
  const container = cy.container();
  if (container === null) return undefined;

  const observer = new ResizeObserver(() => {
    requestAnimationFrame(() => {
      if (cy.destroyed() || input.layoutRunningRef.current) return;
      cy.resize();
      fitCurrentViewport(cy, input.cycleHighlights, input.revealPackageId);
    });
  });
  observer.observe(container);
  return () => observer.disconnect();
}

/*** Fits the current viewport policy without mutating graph projection or layout. */
function fitCurrentViewport(
  cy: Core,
  cycleHighlights: readonly CycleHighlight[],
  revealPackageId?: string
) {
  if (cycleHighlights.length > 0) {
    fitGraph(cy);
    return;
  }
  fitGraphViewport(cy, revealPackageId);
}

/*** Returns whether every active cycle package exists in the rendered graph. */
function containsAllCycleNodes(cy: Core, highlights: readonly CycleHighlight[]): boolean {
  const nodeIds = new Set(cy.nodes().map(node => node.id()));
  return highlights
    .flatMap(highlight => highlight.cycle.packages)
    .every(packageName => nodeIds.has(packageName));
}

/*** Returns a stable identity for the current active-cycle set. */
function getCycleSignature(highlights: readonly CycleHighlight[]): string {
  return highlights
    .map(highlight => highlight.id)
    .sort()
    .join('|');
}

/*** Measures rendered active-cycle size and spread after the canonical fit. */
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

interface UseGraphViewportInput {
  readonly cy: Core | null;
  readonly cycleHighlights: readonly CycleHighlight[];
  readonly layoutRunningRef: { current: boolean };
  readonly revealPackageId?: string;
  readonly setCytoscapeLayoutSpacing: (spacing: number) => void;
  readonly settledRevision: number;
  readonly spacing: number;
  readonly visibleElements: ElementsDefinition | null;
}

interface SettledViewportInput extends Omit<
  UseGraphViewportInput,
  'cy' | 'settledRevision' | 'visibleElements'
> {
  readonly cy: Core;
}

interface ResizeViewportInput {
  readonly cy: Core | null;
  readonly cycleHighlights: readonly CycleHighlight[];
  readonly layoutRunningRef: { current: boolean };
  readonly revealPackageId?: string;
  readonly visibleElements: ElementsDefinition | null;
}
