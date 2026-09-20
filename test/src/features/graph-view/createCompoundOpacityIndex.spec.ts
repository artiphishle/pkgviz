import { describe, expect, it } from '@artiphishle/testosterone';

import { createCompoundOpacityIndex } from '@/features/graph-view/utils/createCompoundOpacityIndex';

describe('[compound depth tint]', () => {
  it('remains visible but bounded even across 100 nested compounds', () => {
    const parents = new Map(
      Array.from({ length: 100 }, (_, index) => [String(index + 1), String(index)])
    );
    const opacities = createCompoundOpacityIndex(parents, new Set());
    const cumulative = Array.from(
      { length: 101 },
      (_, index) => opacities.get(String(index)) ?? 0
    ).reduce((previous, opacity) => {
      const combined = 1 - (1 - previous) * (1 - opacity);
      expect(combined > previous).toBe(true);
      expect(combined < 0.18).toBe(true);
      return combined;
    }, 0);
    expect(cumulative > 0.17).toBe(true);
  });
});
