import { describe, expect, it, render } from '@artiphishle/testosterone';
import { ZoraProvider } from '@zora/ZoraProvider';
import type {
  GraphViewController,
  GraphViewEdge,
  GraphViewFitOptions,
  GraphViewLayoutName,
  GraphViewNode,
} from '@zora/graph-view';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import { GraphZoomControls } from '@/features/graph-view/adapters/inbound/react/GraphZoomControls';
import { useGraphViewport } from '@/features/graph-view/adapters/inbound/react/useGraphViewport';

describe('[graph viewport controls]', () => {
  it('optimizes every material graph geometry once and reuses that operation for manual Fit', async () => {
    const state = { zoom: 1, min: 0.5, max: 8 };
    const fits: (GraphViewFitOptions | undefined)[] = [];
    const controller: GraphViewController = {
      fit: options => fits.push(options),
      getViewport: () => ({ zoom: state.zoom, pan: { x: 0, y: 0 } }),
      getZoomRange: () => ({ min: state.min, max: state.max }),
      setPan: () => {},
      setZoom: zoom => {
        state.zoom = zoom;
      },
      zoomBy: factor => {
        state.zoom *= factor;
      },
    };
    const baseNodes: readonly GraphViewNode[] = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ];
    const baseEdges: readonly GraphViewEdge[] = [{ id: 'a-b', source: 'a', target: 'b' }];
    const host = render(<div />);
    const root = createRoot(host.container);

    function Harness({
      edges,
      layout,
      nodes,
    }: {
      readonly edges: readonly GraphViewEdge[];
      readonly layout: GraphViewLayoutName;
      readonly nodes: readonly GraphViewNode[];
    }) {
      const viewport = useGraphViewport({ edges, layout, nodes });
      return (
        <>
          <button id="ready" onClick={() => viewport.handleReady(controller)}>
            Ready
          </button>
          <button id="settled" onClick={() => viewport.handleLayoutComplete(controller)}>
            Settled
          </button>
          <button id="zoom-event" onClick={viewport.handleViewportChange}>
            Viewport
          </button>
          <GraphZoomControls
            controller={viewport.controller}
            maxZoom={viewport.max}
            minZoom={viewport.min}
            onFit={viewport.fitGraph}
            zoom={viewport.zoom}
          />
        </>
      );
    }

    const renderHarness = async (
      layout: GraphViewLayoutName,
      nodes: readonly GraphViewNode[],
      edges: readonly GraphViewEdge[]
    ) => {
      await act(async () =>
        root.render(
          <ZoraProvider mode="light">
            <Harness edges={edges} layout={layout} nodes={nodes} />
          </ZoraProvider>
        )
      );
    };
    const click = async (selector: string) => {
      await act(async () => host.container.querySelector<HTMLButtonElement>(selector)!.click());
    };
    const slider = () => host.container.querySelector<HTMLInputElement>('input[type="range"]')!;

    try {
      await renderHarness('grid', baseNodes, baseEdges);
      await click('#ready');
      expect(slider().max).toBe('8');

      state.zoom = 5;
      await click('#zoom-event');
      expect(slider().value).toBe('5');
      expect(fits).toEqual([]);

      await click('#settled');
      expect(fits).toEqual([{ optimizeSpacing: true }]);
      await click('#settled');
      expect(fits).toEqual([{ optimizeSpacing: true }]);

      state.max = 3;
      state.zoom = 1;
      await click('#settled');
      expect(slider().max).toBe('3');
      expect(slider().value).toBe('1');

      await click('button[aria-label="Fit graph and optimize spacing for readability"]');
      expect(fits).toEqual([{ optimizeSpacing: true }, { optimizeSpacing: true }]);

      const presentationOnlyNodes = baseNodes.map(node => ({ ...node, classes: 'selected' }));
      await renderHarness('grid', presentationOnlyNodes, baseEdges);
      await click('#settled');
      expect(fits).toHaveLength(2);

      const expandedNodes = [...baseNodes, { id: 'c', label: 'C' }];
      const expandedEdges = [...baseEdges, { id: 'b-c', source: 'b', target: 'c' }];
      await renderHarness('grid', expandedNodes, expandedEdges);
      await click('#settled');
      expect(fits).toHaveLength(3);

      await renderHarness('circle', expandedNodes, expandedEdges);
      await click('#settled');
      expect(fits).toHaveLength(4);
      expect(fits.every(options => options?.optimizeSpacing === true)).toBe(true);
    } finally {
      await act(async () => root.unmount());
      host.unmount();
    }
  });
});
