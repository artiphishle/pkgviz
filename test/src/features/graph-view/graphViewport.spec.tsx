import { describe, expect, it, render } from '@artiphishle/testosterone';
import type {
  GraphViewController,
  GraphViewFitOptions,
  GraphViewLayoutName,
} from '@zora/graph-view';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import { GraphZoomControls } from '@/features/graph-view/adapters/inbound/react/GraphZoomControls';
import { useGraphViewport } from '@/features/graph-view/adapters/inbound/react/useGraphViewport';

describe('[graph viewport controls]', () => {
  it('refreshes owner bounds after navigation and only compacts on explicit Fit', async () => {
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
    const host = render(<div />);
    const root = createRoot(host.container);
    function Harness({ layout }: { layout: GraphViewLayoutName }) {
      const viewport = useGraphViewport(layout);
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
            zoom={viewport.zoom}
            minZoom={viewport.min}
            maxZoom={viewport.max}
          />
        </>
      );
    }
    const click = async (selector: string) => {
      await act(async () => host.container.querySelector<HTMLButtonElement>(selector)!.click());
    };
    const slider = () => host.container.querySelector<HTMLInputElement>('input[type="range"]')!;
    try {
      await act(async () => root.render(<Harness layout="grid" />));
      await click('#ready');
      expect(slider().max).toBe('8');
      state.zoom = 5;
      await click('#zoom-event');
      expect(slider().value).toBe('5');
      expect(fits).toEqual([]);
      state.max = 3;
      state.zoom = 1;
      await click('#settled');
      expect(slider().max).toBe('3');
      expect(slider().value).toBe('1');
      expect(fits).toEqual([]);
      await click('button[aria-label="Fit graph and optimize spacing for readability"]');
      expect(fits).toEqual([{ optimizeSpacing: true }]);
      await act(async () => root.render(<Harness layout="circle" />));
      await click('#settled');
      expect(fits).toEqual([{ optimizeSpacing: true }, undefined]);
    } finally {
      await act(async () => root.unmount());
      host.unmount();
    }
  });
});
