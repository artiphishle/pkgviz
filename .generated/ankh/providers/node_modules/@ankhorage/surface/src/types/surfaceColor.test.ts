import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'bun:test';

import { SURFACE_COLORS, SURFACE_EMPHASES } from '../constants/surfaceColor';
import type { SurfaceColor, SurfaceEmphasis } from './surfaceColor';

describe('surface color type ownership', () => {
  it('derives public types from runtime constants and exports both deliberately', () => {
    const color: SurfaceColor = 'danger';
    const emphasis: SurfaceEmphasis = 'muted';
    const indexSource = readFileSync(new URL('../index.ts', import.meta.url), 'utf8');
    expect(SURFACE_COLORS).toContain(color);
    expect(SURFACE_EMPHASES).toContain(emphasis);
    expect(indexSource).toContain("from './constants/surfaceColor';");
    expect(indexSource).toContain("from './types/surfaceColor';");
  });
});
