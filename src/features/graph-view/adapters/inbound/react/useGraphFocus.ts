'use client';
import type { Core, ElementsDefinition } from 'cytoscape';
import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

import type { CycleHighlight } from '@/types/auditVisualization';
import { applyCycleHighlights } from '@/utils/graph/applyCycleHighlights';
import { fitGraphViewport, revealGraphPackage } from '@/utils/graph/fitGraphViewport';

/*** Owns cycle highlighting, tree reveal focus, and resize-driven viewport fitting. */
export function useGraphFocus(input: UseGraphFocusInput) {
  const revealPackageIdRef = useRef<string | undefined>(input.revealPackageId);
  revealPackageIdRef.current = input.revealPackageId;

  useEffect(() => {
    const cy = input.cy;
    if (cy === null || input.visibleElements === null || cy.destroyed()) return;
    const highlighted = applyCycleHighlights(cy, input.cycleHighlights);
    if (highlighted.empty()) return;
    requestAnimationFrame(() => fitGraphViewport(cy, revealPackageIdRef.current));
  }, [input.cy, input.cycleHighlights, input.visibleElements]);

  useEffect(() => {
    const cy = input.cy;
    if (
      cy === null ||
      input.visibleElements === null ||
      input.revealPackageId === undefined ||
      input.cycleHighlights.length > 0 ||
      cy.destroyed()
    ) {
      return;
    }
    revealGraphPackage(cy, input.revealPackageId);
  }, [input.cy, input.cycleHighlights, input.revealPackageId, input.visibleElements]);

  useEffect(() => observeGraphResize(input.cy, input.containerRef, revealPackageIdRef), [
    input.containerRef,
    input.cy,
  ]);
}

interface UseGraphFocusInput {
  readonly containerRef: RefObject<HTMLDivElement | null>;
  readonly cy: Core | null;
  readonly cycleHighlights: readonly CycleHighlight[];
  readonly revealPackageId?: string;
  readonly visibleElements: ElementsDefinition | null;
}

/*** Observes graph container resizing and re-applies the current viewport focus policy. */
function observeGraphResize(
  cy: Core | null,
  containerRef: RefObject<HTMLDivElement | null>,
  revealPackageIdRef: RefObject<string | undefined>
) {
  const container = containerRef.current;
  if (cy === null || container === null || cy.destroyed()) return undefined;

  const observer = new ResizeObserver(() => {
    requestAnimationFrame(() => fitGraphViewport(cy, revealPackageIdRef.current));
  });
  observer.observe(container);
  return () => observer.disconnect();
}
