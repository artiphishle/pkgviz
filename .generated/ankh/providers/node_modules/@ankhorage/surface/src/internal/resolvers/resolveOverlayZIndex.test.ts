import { describe, expect, it } from 'bun:test';

import { resolveOverlayZIndex } from './resolveOverlayZIndex';

describe('resolveOverlayZIndex', () => {
  it('assigns higher base layers to later overlay types', () => {
    expect(resolveOverlayZIndex('modal')).toBeLessThan(resolveOverlayZIndex('menu'));
    expect(resolveOverlayZIndex('menu')).toBeLessThan(resolveOverlayZIndex('popover'));
    expect(resolveOverlayZIndex('popover')).toBeLessThan(resolveOverlayZIndex('tooltip'));
    expect(resolveOverlayZIndex('tooltip')).toBeLessThan(resolveOverlayZIndex('toast'));
  });

  it('increments the z-index within the same layer stack', () => {
    expect(resolveOverlayZIndex('modal', 1)).toBe(resolveOverlayZIndex('modal', 0) + 1);
  });
});
