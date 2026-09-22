import { existsSync } from 'node:fs';

import { describe, expect, it } from 'bun:test';

describe('canonical Surface ownership', () => {
  it('does not retain superseded technical roots or local generic deep utilities', () => {
    const src = new URL('.', import.meta.url);
    expect(existsSync(new URL('./context', src))).toBe(false);
    expect(existsSync(new URL('./theme', src))).toBe(false);
    expect(existsSync(new URL('./contracts', src))).toBe(false);
    expect(existsSync(new URL('./interactionPolicy.ts', src))).toBe(false);
    expect(existsSync(new URL('./surfaceColor.ts', src))).toBe(false);
    expect(existsSync(new URL('./utils/deepEqual.ts', src))).toBe(false);
    expect(existsSync(new URL('./utils/deepMerge.ts', src))).toBe(false);
  });
});
