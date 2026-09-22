import { describe, expect, it } from 'bun:test';

import { resolveOverlayAnimation } from './resolveOverlayAnimation';

describe('resolveOverlayAnimation', () => {
  it('returns stable transition values for each overlay layer', () => {
    const modal = resolveOverlayAnimation('modal');
    const drawer = resolveOverlayAnimation('drawer');
    const tooltip = resolveOverlayAnimation('tooltip');

    expect(modal.backdropOpacity).toBeGreaterThan(drawer.backdropOpacity);
    expect(drawer.offset).toBeGreaterThan(tooltip.offset);
    expect(tooltip.enterDuration).toBeLessThan(modal.enterDuration);
  });
});
