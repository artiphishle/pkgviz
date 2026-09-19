'use client';
import type { Core, ElementsDefinition } from 'cytoscape';
import { useEffect } from 'react';

import type { CycleHighlight } from '@/types/auditVisualization';
import { applyCycleHighlights } from '@/utils/graph/applyCycleHighlights';
import { fitGraphViewport, revealGraphPackage } from '@/utils/graph/fitGraphViewport';

/*** Owns cycle highlighting, tree reveal focus, and resize-driven viewport fitting. */
export function useGraphFocus(input: UseGraphFocusInput) {
  useEffect(() => {
    const cy = input.cy;
    if (cy === null || input.visibleElements === null || cy.destroyed()) return;
    const highlighted = applyCycleHighlights(cy, input.cycleHighlights);
    if (highlighted.empty()) return;

    const frame = requestAnimationFrame(() => fitGraphViewport(cy, input.revealPackageId));
    return () => cancelAnimationFrame(frame);
  }, [input.cy, input.cycleHighlights, input.revealPackageId, input.visibleElements]);

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

  useEffect(() => observeGraphResize(input.cy, input.revealPackageId), [
    input.cy,
    input.revealPackageId,
  ]);
}

interface UseGraphFocusInput {
  readonly cy: Core | null;
  readonly cycleHighlights: readonly CycleHighlight[];
  readonly revealPackageId?: string;
  readonly visibleElements: ElementsDefinition | null;
}

/*** Observes graph container resizing and re-applies the current viewport focus policy. */
function observeGraphResize(cy: Core | null, revealPackageId?: string) {
  const container = cy?.container();
  if (cy === null || container === null || cy.destroyed()) return undefined;

  const observer = new ResizeObserver(() => {
    requestAnimationFrame(() => fitGraphViewport(cy, revealPackageId));
  });
  observer.observe(container);
  return () => observer.disconnect();
}
