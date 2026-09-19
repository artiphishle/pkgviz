'use client';
import type { Core, ElementsDefinition, LayoutOptions, Layouts } from 'cytoscape';
import { useCallback, useEffect, useEffectEvent, useRef } from 'react';

import { LAYOUTS } from '@/layouts/constants';
import { fitGraphViewport } from '@/utils/graph/fitGraphViewport';

/*** Owns Cytoscape layout creation, cancellation, reruns, and post-layout fitting. */
export function useGraphLayout(input: UseGraphLayoutInput) {
  const { cy, elements, layout, revealPackageId, spacing } = input;
  const layoutRef = useRef<Layouts | null>(null);
  const layoutRunningRef = useRef(false);
  const fitAfterLayout = useEffectEvent((instance: Core) => {
    layoutRunningRef.current = false;
    fitGraphViewport(instance, revealPackageId);
  });
  const makeLayoutOptions = useCallback(
    (name: LayoutOptions['name']): LayoutOptions & Record<string, unknown> => ({
      ...resolveLayoutOptions(name),
      spacingFactor: spacing,
      nodeDimensionsIncludeLabels: true,
      fit: true,
      animate: false,
      animationDuration: 400,
    }),
    [spacing]
  );

  useEffect(() => {
    if (cy === null || elements === null || cy.destroyed()) return;
    stopLayout(layoutRef.current);
    cy.resize();

    const frame = requestAnimationFrame(() => {
      if (cy.destroyed()) return;
      const activeLayout = cy.layout(makeLayoutOptions(layout));
      layoutRef.current = activeLayout;
      layoutRunningRef.current = true;
      cy.one('layoutstop', () => fitAfterLayout(cy));
      activeLayout.run();
    });

    return () => {
      cancelAnimationFrame(frame);
      stopLayout(layoutRef.current);
      layoutRef.current = null;
      layoutRunningRef.current = false;
    };
  }, [cy, elements, layout, makeLayoutOptions]);

  useEffect(
    () => observeGraphResize(cy, revealPackageId, layoutRunningRef),
    [cy, revealPackageId]
  );
}

interface UseGraphLayoutInput {
  readonly cy: Core | null;
  readonly elements: ElementsDefinition | null;
  readonly layout: LayoutOptions['name'];
  readonly revealPackageId?: string;
  readonly spacing: number;
}

/*** Resolves one supported layout without dynamic object-key injection. */
function resolveLayoutOptions(name: LayoutOptions['name']): LayoutOptions {
  if (name === 'breadthfirst') return LAYOUTS.breadthfirst;
  if (name === 'circle') return LAYOUTS.circle;
  if (name === 'elk') return LAYOUTS.elk;
  if (name === 'grid') return LAYOUTS.grid;
  if (name === 'concentric') return LAYOUTS.concentric;
  throw new Error(`Unsupported Cytoscape layout: ${String(name)}`);
}

/*** Stops a previous Cytoscape layout without leaking adapter-specific disposal failures. */
function stopLayout(layout: Layouts | null) {
  try {
    layout?.stop();
  } catch {
    // Cytoscape may already have disposed the layout with the graph instance.
  }
}

/*** Refits only settled graph layouts after genuine container size changes. */
function observeGraphResize(
  cy: Core | null,
  revealPackageId: string | undefined,
  layoutRunningRef: { current: boolean }
) {
  if (cy === null || cy.destroyed()) return undefined;
  const container = cy.container();
  if (container === null) return undefined;

  const observer = new ResizeObserver(() => {
    requestAnimationFrame(() => {
      if (cy.destroyed() || layoutRunningRef.current) return;
      cy.resize();
      fitGraphViewport(cy, revealPackageId);
    });
  });
  observer.observe(container);
  return () => observer.disconnect();
}
