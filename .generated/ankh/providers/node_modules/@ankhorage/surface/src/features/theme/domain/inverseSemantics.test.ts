import type { ThemeConfig } from '@ankhorage/contracts';
import { describe, expect, it } from 'bun:test';

import { generatePalette } from './generatePalette';

const config: ThemeConfig = {
  id: 'inverse-semantics-test',
  name: 'Inverse semantics test',
  light: {
    primaryColor: '#3B82F6',
    harmony: 'monochromatic',
  },
  dark: {
    primaryColor: '#3B82F6',
    harmony: 'monochromatic',
  },
};

describe('inverse semantics', () => {
  it('provides a paired inverse surface and content color in light mode', () => {
    const { semantics, swatches } = generatePalette(config, 'light');

    expect(semantics.surface.inverse).toBe(swatches.neutral[900]);
    expect(semantics.content.inverse).toBe(swatches.neutral[50]);
  });

  it('provides a paired inverse surface and content color in dark mode', () => {
    const { semantics, swatches } = generatePalette(config, 'dark');

    expect(semantics.surface.inverse).toBe(swatches.neutral[50]);
    expect(semantics.content.inverse).toBe(swatches.neutral[900]);
  });

  it('resolves global inverse content from neutral semantics instead of brand foreground', () => {
    const brightBrandConfig: ThemeConfig = {
      ...config,
      light: {
        ...config.light,
        primaryColor: '#FDE047',
      },
    };
    const { semantics, swatches } = generatePalette(brightBrandConfig, 'light');

    expect(semantics.surface.inverse).toBe(swatches.neutral[900]);
    expect(semantics.content.inverse).toBe(swatches.neutral[50]);
    expect(semantics.content.inverse).not.toBe(semantics.brand.onSolidText);
  });
});
