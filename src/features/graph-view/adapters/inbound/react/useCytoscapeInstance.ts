'use client';
import cytoscape, { type Core } from 'cytoscape';
import { useEffect, useRef, useState } from 'react';

import { getCanvasBg, getStyle as getCommonStyle } from '@/layouts/style';

/*** Owns only Cytoscape creation and destruction for the graph container. */
export function useCytoscapeInstance() {
  const cyRef = useRef<HTMLDivElement>(null);
  const [cyInstance, setCyInstance] = useState<Core | null>(null);

  useEffect(() => {
    if (!cyRef.current) return;
    const container = cyRef.current;
    const cy = createCytoscape(container);
    setCyInstance(cy);

    return () => {
      cy.destroy();
      setCyInstance(null);
    };
  }, []);

  return { cyRef, cyInstance };
}

/*** Creates the graph runtime with stable viewport and selection defaults. */
function createCytoscape(container: HTMLDivElement): Core {
  const cy = cytoscape({
    container,
    elements: [],
    hideEdgesOnViewport: true,
    minZoom: 0.01,
    maxZoom: 2,
    selectionType: 'additive',
    style: getCommonStyle({ nodes: [], edges: [] }, 'light'),
    userPanningEnabled: true,
  });
  container.style.background = getCanvasBg('light');
  return cy;
}
