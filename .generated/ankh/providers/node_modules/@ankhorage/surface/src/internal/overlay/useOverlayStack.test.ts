import { describe, expect, it } from 'bun:test';

import { type OverlayEntry, sortOverlayEntries } from './useOverlayStack';

describe('sortOverlayEntries', () => {
  it('sorts overlays by z-index then registration order', () => {
    const overlays: OverlayEntry[] = [
      { id: 'menu-1', layer: 'menu', node: null, order: 2, zIndex: 1200 },
      { id: 'modal-1', layer: 'modal', node: null, order: 0, zIndex: 1000 },
      { id: 'menu-0', layer: 'menu', node: null, order: 1, zIndex: 1200 },
    ];

    expect(sortOverlayEntries(overlays).map((entry) => entry.id)).toEqual([
      'modal-1',
      'menu-0',
      'menu-1',
    ]);
  });

  it('recomputes per-layer stack indices to avoid z-index collisions after removals', () => {
    const overlays: OverlayEntry[] = [
      { id: 'menu-0', layer: 'menu', node: null, order: 1, zIndex: 1200 },
      { id: 'menu-2', layer: 'menu', node: null, order: 3, zIndex: 1200 },
    ];

    const sorted = sortOverlayEntries(overlays);

    expect(sorted[0]?.zIndex).toBe(1200);
    expect(sorted[1]?.zIndex).toBe(1201);
  });
});
