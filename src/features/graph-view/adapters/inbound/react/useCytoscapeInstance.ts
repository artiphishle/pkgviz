'use client';
import cytoscape, { type Core } from 'cytoscape';
import { useCallback, useRef, useState } from 'react';

import { getCanvasBg, getStyle as getCommonStyle } from '@/layouts/style';

/*** Owns only Cytoscape creation and destruction for the graph container callback ref. */
export function useCytoscapeInstance() {
  const instanceRef = useRef<Core | null>(null);
  const [cyInstance, setCyInstance] = useState<Core | null>(null);
  const cyRef = useCallback((container: HTMLDivElement | null) => {
    instanceRef.current?.destroy();
    instanceRef.current = null;

    if (container === null) {
      setCyInstance(null);
      return;
    }

    const cy = createCytoscape(container);
    instanceRef.current = cy;
    setCyInstance(cy);
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
