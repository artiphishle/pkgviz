import type { ThemeConfig, ThemeGlobalTokenOverrides } from '@ankhorage/contracts';
import { describe, expect, it } from 'bun:test';

import { createTheme } from './createTheme';

const defaultConfig = createTheme().config;

describe('createTheme token validation', () => {
  it('rejects negative or non-finite numeric tokens', () => {
    expect(() => createTheme(withTokens({ spacing: { m: -1 } }))).toThrow(RangeError);
    expect(() => createTheme(withTokens({ radii: { l: Number.NaN } }))).toThrow(RangeError);
    expect(() => createTheme(withTokens({ shadows: { soft: Number.POSITIVE_INFINITY } }))).toThrow(
      RangeError,
    );
  });

  it('keeps reserved zero tokens canonical', () => {
    expect(() => createTheme(withTokens({ spacing: { none: 1 } }))).toThrow('spacing.none');
    expect(() => createTheme(withTokens({ radii: { none: 1 } }))).toThrow('radii.none');
  });

  it('requires positive typography dimensions', () => {
    expect(() => createTheme(withTokens({ typography: { sizes: { m: 0 } } }))).toThrow(
      'typography.sizes.m',
    );
    expect(() =>
      createTheme(withTokens({ typography: { headings: { '1': { lineHeight: 0 } } } })),
    ).toThrow('typography.headings.1.lineHeight');
  });

  it('rejects unknown heading and weight slots', () => {
    expect(() =>
      createTheme(withTokens({ typography: { headings: { hero: { size: 40 } } } })),
    ).toThrow('Unknown typography heading token');
    expect(() => createTheme(withTokens({ typography: { weights: { hero: '700' } } }))).toThrow(
      'Unknown typography weight token',
    );
  });

  it('rejects unsupported heading and font-weight values', () => {
    expect(() =>
      createTheme(withTokens({ typography: { headings: { '1': { weight: '900' } } } })),
    ).toThrow('Invalid heading weight');
    expect(() => createTheme(withTokens({ typography: { weights: { medium: '950' } } }))).toThrow(
      'Invalid font weight',
    );
  });
});

function withTokens(tokens: ThemeGlobalTokenOverrides): ThemeConfig {
  return { ...defaultConfig, tokens };
}
