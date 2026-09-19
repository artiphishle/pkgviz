'use client';
import type { Core, ElementsDefinition, LayoutOptions, Layouts } from 'cytoscape';
import { useCallback, useEffect, useEffectEvent, useRef } from 'react';

import { LAYOUTS } from '@/layouts/constants';
import { fitGraphViewport } from '@/utils/graph/fitGraphViewport';

/*** Owns Cytoscape layout creation, cancellation, reruns, and post-layout fitting. */
export function useGraphLayout(input: UseGraphLayoutInput) {
  const layoutRef = useRef<Layouts | null>(null);
  const fitAfterLayout = useEffectEvent((cy: Core) => {
    fitGraphViewport(cy, input.revealPackageId);
  });
  const makeLayoutOptions = useCallback(
    (name: LayoutOptions['name']): LayoutOptions & Record<string, unknown> => ({
      ...LAYOUTS[name],
      spacingFactor: input.spacing,
      nodeDimensionsIncludeLabels: true,
      fit: true,
      animate: false,
      animationDuration: 400,
    }),
    [input.spacing]
  );

  useEffect(() => {
    const cy = input.cy;
    if (cy === null || input.elements === null || cy.destroyed()) return;
    stopLayout(layoutRef.current);
    cy.resize();

    const frame = requestAnimationFrame(() => {
      if (cy.destroyed()) return;
      const layout = cy.layout(makeLayoutOptions(input.layout));
      layoutRef.current = layout;
      cy.one('layoutstop', () => fitAfterLayout(cy));
      layout.run();
    });

    return () => {
      cancelAnimationFrame(frame);
      stopLayout(layoutRef.current);
      layoutRef.current = null;
    };
  }, [input.cy, input.elements, input.layout, makeLayoutOptions]);
}

interface UseGraphLayoutInput {
  readonly cy: Core | null;
  readonly elements: ElementsDefinition | null;
  readonly layout: LayoutOptions['name'];
  readonly revealPackageId?: string;
  readonly spacing: number;
}

/*** Stops a previous Cytoscape layout without leaking adapter-specific disposal failures. */
function stopLayout(layout: Layouts | null) {
  try {
    layout?.stop();
  } catch {
    // Cytoscape may already have disposed the layout with the graph instance.
  }
}
