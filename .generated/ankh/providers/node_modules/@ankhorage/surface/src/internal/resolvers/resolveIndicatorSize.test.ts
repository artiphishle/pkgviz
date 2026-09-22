import { describe, expect, it } from 'bun:test';

import { resolveIndicatorSize } from './resolveIndicatorSize';

describe('resolveIndicatorSize', () => {
  it('returns a stable size map for each control size', () => {
    expect(resolveIndicatorSize('s')).toEqual({
      checkbox: 16,
      checkboxIndicator: 10,
      radio: 16,
      radioDot: 8,
      switchWidth: 30,
      switchHeight: 18,
      switchThumb: 12,
    });
    expect(resolveIndicatorSize('m').switchWidth).toBe(34);
    expect(resolveIndicatorSize('l').switchThumb).toBe(18);
  });
});
