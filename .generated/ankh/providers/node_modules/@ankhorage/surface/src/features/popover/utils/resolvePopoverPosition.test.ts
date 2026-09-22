import { describe, expect, it } from 'bun:test';

import { resolvePopoverPosition } from './resolvePopoverPosition';

describe('resolvePopoverPosition', () => {
  it('places bottom-start content below the anchor', () => {
    expect(
      resolvePopoverPosition({
        anchor: { height: 40, width: 120, x: 100, y: 80 },
        contentSize: { height: 180, width: 240 },
        offset: 8,
        placement: 'bottom-start',
        viewport: { height: 800, width: 1200 },
        viewportPadding: 8,
      }),
    ).toEqual({ left: 100, top: 128 });
  });

  it('clamps content to the available viewport', () => {
    expect(
      resolvePopoverPosition({
        anchor: { height: 40, width: 80, x: 980, y: 700 },
        contentSize: { height: 240, width: 300 },
        offset: 8,
        placement: 'bottom-end',
        viewport: { height: 800, width: 1200 },
        viewportPadding: 8,
      }),
    ).toEqual({ left: 760, top: 552 });
  });
});
