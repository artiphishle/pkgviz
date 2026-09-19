'use client';
import type { Core, ElementsDefinition } from 'cytoscape';
import { useEffect } from 'react';

import type { CycleHighlight } from '@/types/auditVisualization';
import { applyCycleHighlights } from '@/utils/graph/applyCycleHighlights';
import { fitGraphViewport, revealGraphPackage } from '@/utils/graph/fitGraphViewport';

/*** Owns cycle highlighting, tree reveal focus, and resize-driven viewport fitting. */
export function useGraphFocus(input: UseGraphFocusInput) {
  const { cy, cycleHighlights, revealPackageId, visibleElements } = input;

  useEffect(() => {
    if (cy === null || visibleElements === null || cy.destroyed()) return;
    const highlighted = applyCycleHighlights(cy, cycleHighlights);
    if (highlighted.empty()) return;

    const frame = requestAnimationFrame(() => fitGraphViewport(cy, revealPackageId));
    return () => cancelAnimationFrame(frame);
  }, [cy, cycleHighlights, revealPackageId, visibleElements]);

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

  useEffect(
    () => observeGraphResize(cy, revealPackageId),
    [cy, revealPackageId]
  );
}

interface UseGraphFocusInput {
  readonly cy: Core | null;
  readonly cycleHighlights: readonly CycleHighlight[];
  readonly revealPackageId?: string;
  readonly visibleElements: ElementsDefinition | null;
}

/*** Observes graph container resizing and re-applies the current viewport focus policy. */
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
