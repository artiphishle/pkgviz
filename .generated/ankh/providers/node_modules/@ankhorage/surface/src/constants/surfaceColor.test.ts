import { describe, expect, it } from 'bun:test';

import {
  SURFACE_COLORS,
  SURFACE_EMPHASES,
  SURFACE_PALETTE_COLORS,
  SURFACE_STATUS_COLORS,
} from './surfaceColor';

describe('surface color constants', () => {
  it('keeps canonical color and emphasis catalogs unique and aligned', () => {
    expect(new Set(SURFACE_COLORS).size).toBe(SURFACE_COLORS.length);
    expect(new Set(SURFACE_EMPHASES).size).toBe(SURFACE_EMPHASES.length);
    for (const color of [...SURFACE_PALETTE_COLORS, ...SURFACE_STATUS_COLORS]) {
      expect(SURFACE_COLORS).toContain(color);
    }
  });
});
