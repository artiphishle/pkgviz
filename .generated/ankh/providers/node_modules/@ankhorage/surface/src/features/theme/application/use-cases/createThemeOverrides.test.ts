import type { ThemeConfig } from '@ankhorage/contracts';
import { describe, expect, it } from 'bun:test';

import { DEFAULT_TOKENS } from '../../constants';
import { createTheme } from './createTheme';

const defaultConfig = createTheme().config;

describe('createTheme authored global tokens', () => {
  it('preserves defaults when no authored overrides exist', () => {
    const theme = createTheme(defaultConfig);
    expect(theme.spacing).toEqual(DEFAULT_TOKENS.spacing);
    expect(theme.radii).toEqual(DEFAULT_TOKENS.radii);
    expect(theme.typography.sizes).toEqual(DEFAULT_TOKENS.typography.sizes);
    expect(theme.typography.weights).toEqual(DEFAULT_TOKENS.typography.weights);
    expect(theme.shadows).toEqual(DEFAULT_TOKENS.shadows);
  });

  it('merges authored global tokens without copying omitted defaults into config', () => {
    const config: ThemeConfig = {
      ...defaultConfig,
      tokens: {
        spacing: { m: 18, hero: 64 },
        radii: { l: 20, pill: 999 },
        typography: {
          sizes: { m: 17, display: 44 },
          weights: { medium: '600' },
          headings: { '1': { size: 36, lineHeight: 44, weight: 'semiBold' } },
        },
        shadows: { soft: 3, floating: 12 },
      },
    };
    const theme = createTheme(config);
    expect(theme.spacing).toMatchObject({ xs: 4, m: 18, hero: 64 });
    expect(theme.radii).toMatchObject({ m: 8, l: 20, pill: 999 });
    expect(theme.typography.sizes).toMatchObject({ s: 14, m: 17, display: 44 });
    expect(theme.typography.weights).toMatchObject({ regular: '400', medium: '600' });
    expect(theme.typography.headings[1]).toEqual({ size: 36, lineHeight: 44, weight: 'semiBold' });
    expect(theme.shadows).toMatchObject({ medium: 4, soft: 3, floating: 12 });
    expect(theme.config.tokens).toEqual(config.tokens);
  });

  it('keeps module-derived font families isolated per resolved theme', () => {
    const withFont = createTheme(defaultConfig, 'light', 'source-sans');
    const withoutFont = createTheme(defaultConfig);
    expect(withFont.typography.fonts.normal['400']).toBe('SourceSans_400Regular');
    expect(withoutFont.typography.fonts.normal['400']).toBeUndefined();
    expect(DEFAULT_TOKENS.typography.fonts.normal['400']).toBeUndefined();
  });
});
