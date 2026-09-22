import type { SemanticColorToken } from '@ankhorage/color-theory';
import {
  COLOR_HARMONIES,
  DARK_SEMANTIC_COLOR_REFERENCES,
  DEFAULT_SEMANTIC_STATUS_COLOR_SEEDS,
  LIGHT_SEMANTIC_COLOR_REFERENCES,
} from '@ankhorage/color-theory';
import type { ThemeConfig } from '@ankhorage/contracts';
import { isRecord, readOwnProperty } from '@ankhorage/utility/object';
import { expect, it } from 'bun:test';

import { generatePalette } from './generatePalette';
import { resolveSemanticColors } from './resolveSemanticColors';

const mockConfig: ThemeConfig = {
  id: 'test',
  name: 'Test Theme',
  light: {
    primaryColor: '#3B82F6',
    harmony: 'triadic',
  },
  dark: {
    primaryColor: '#3B82F6',
    harmony: 'triadic',
  },
};

function expectCompleteSemanticValues(value: unknown): void {
  if (typeof value === 'string') {
    expect(value.length).toBeGreaterThan(0);
    return;
  }
  if (!isRecord(value)) return;
  Object.values(value).forEach(expectCompleteSemanticValues);
}

it('generates a valid palette for light mode', () => {
  const { colors, swatches, semantics } = generatePalette(mockConfig, 'light');

  expect(colors.primary).toBeDefined();
  expect(swatches.primary).toBeDefined();
  expect(swatches.neutral).toBeDefined();
  expect(Object.keys(swatches.primary)).toHaveLength(11);
  expect(Object.keys(swatches.neutral)).toHaveLength(11);

  // Surface semantic aliases
  expect(semantics.surface.default).toBe(semantics.neutral.surface);
  expect(semantics.content.muted).toBe(semantics.neutral.textMuted);
  expect(semantics.border.focus).toBe(semantics.brand.outline);
  expect(semantics.action.primary.base).toBe(semantics.brand.base);
  expect(semantics.action.danger.base).toBe(semantics.danger.base);

  // Surface runtime semantic aliases derived from ordinal swatches
  expect(semantics.accent.base).toBeDefined();
  expect(semantics.highlight.base).toBeDefined();
  // accent/highlight are Surface semantic aliases (tertiary/quaternary fallback to primary when absent)
  expect(semantics.accent.base).toBe(colors.accent);
  expect(semantics.highlight.base).toBe(colors.highlight);
});

it('generates a valid palette for dark mode', () => {
  const { colors, swatches, semantics } = generatePalette(mockConfig, 'dark');

  expect(colors.background).toBe(semantics.neutral.bg);
  expect(semantics.surface.inverse).toBe(swatches.neutral[50]);
  expect(semantics.content.inverse).toBe(swatches.neutral[900]);
});

it('uses the Color Theory status owner independently from brand harmony', () => {
  const statusConfig: ThemeConfig = {
    ...mockConfig,
    light: { primaryColor: '#dc2626', harmony: 'monochromatic' },
    dark: { primaryColor: '#dc2626', harmony: 'monochromatic' },
  };
  const light = generatePalette(statusConfig, 'light');
  const dark = generatePalette(statusConfig, 'dark');

  expect(light.semantics.danger.base).toBe('#ef4444');
  expect(light.semantics.success.base).toBe('#22c55e');
  expect(light.semantics.warning.base).toBe('#f59e0b');
  expect(light.semantics.error.base).toBe(light.semantics.danger.base);
  expect(light.semantics.info.base).toBe(DEFAULT_SEMANTIC_STATUS_COLOR_SEEDS.info);
  expect(light.semantics.info.base).not.toBe(light.semantics.brand.base);

  expect(dark.semantics.danger.base).toBe('#ef4444');
  expect(dark.semantics.success.base).toBe('#22c55e');
  expect(dark.semantics.warning.base).toBe('#f59e0b');
  expect(dark.semantics.error.base).toBe(dark.semantics.danger.base);
  expect(dark.semantics.info.base).toBe(DEFAULT_SEMANTIC_STATUS_COLOR_SEEDS.info);
  expect(dark.semantics.info.base).not.toBe(dark.semantics.brand.base);
  expect(light.semantics.error).toBe(light.semantics.danger);
  expect(dark.semantics.error).toBe(dark.semantics.danger);
});

it('uses mode-aware role semantics for dark mode soft states', () => {
  const light = generatePalette(mockConfig, 'light');
  const dark = generatePalette(mockConfig, 'dark');

  expect(light.semantics.brand.softBg).toBe(light.swatches.primary[100]);
  expect(light.semantics.brand.softHover).toBe(light.swatches.primary[200]);
  expect(light.semantics.brand.softActive).toBe(light.swatches.primary[300]);
  expect(dark.semantics.brand.softBg).toBe(dark.swatches.primary[900]);
  expect(dark.semantics.brand.softHover).toBe(dark.swatches.primary[800]);
  expect(dark.semantics.brand.softActive).toBe(dark.swatches.primary[700]);
});

it('preserves the primary color at swatch step 500 in light mode', () => {
  const { swatches } = generatePalette(mockConfig, 'light');
  expect(String(swatches.primary[500])).toBe(mockConfig.light.primaryColor);
});

it('preserves the primary color at swatch step 500 in dark mode', () => {
  const { swatches } = generatePalette(mockConfig, 'dark');
  expect(String(swatches.primary[500])).toBe(mockConfig.dark.primaryColor);
});

it('provides a neutral swatch with neutralKeyColor at step 500', () => {
  const { swatches } = generatePalette(mockConfig, 'light');
  // neutral swatch must have a step 500 entry
  expect(swatches.neutral[500]).toBeDefined();
});

it('throws deterministically on invalid primary color', () => {
  const config = {
    ...mockConfig,
    light: { ...mockConfig.light, primaryColor: 'not-a-hex-color' },
  };
  expect(() => generatePalette(config, 'light')).toThrow();
});

it('throws deterministically on invalid primary color in dark mode', () => {
  const config = {
    ...mockConfig,
    dark: { ...mockConfig.dark, primaryColor: 'rgb(0,0,0)' },
  };
  expect(() => generatePalette(config, 'dark')).toThrow();
});

it('emits required semantic roles for all harmonies', () => {
  for (const harmony of COLOR_HARMONIES) {
    const config = {
      ...mockConfig,
      light: { ...mockConfig.light, harmony },
      dark: { ...mockConfig.dark, harmony },
    };
    const light = generatePalette(config, 'light');
    const dark = generatePalette(config, 'dark');
    expectCompleteSemanticValues(light.semantics);
    expectCompleteSemanticValues(dark.semantics);
  }
});

it('resolves canonical semantic references and returns their selected steps', () => {
  const light = generatePalette(mockConfig, 'light');
  const dark = generatePalette(mockConfig, 'dark');

  expect(light.colorDiagnostics.semanticReferences).toBe(LIGHT_SEMANTIC_COLOR_REFERENCES);
  expect(dark.colorDiagnostics.semanticReferences).toBe(DARK_SEMANTIC_COLOR_REFERENCES);
  expect(light.colorDiagnostics.generated.swatches).toBe(light.swatches);
  expect(dark.colorDiagnostics.generated.swatches).toBe(dark.swatches);
});

it('returns measured selections and contrast diagnostics for both modes', () => {
  for (const mode of ['light', 'dark'] as const) {
    const palette = generatePalette(mockConfig, mode);

    expect(palette.colorDiagnostics.selections.length).toBeGreaterThan(0);
    expect(
      palette.colorDiagnostics.selections.every(({ result }) => result.selected !== null),
    ).toBe(true);
    expect(palette.colorDiagnostics.contrasts.length).toBeGreaterThan(0);
    expect(palette.colorDiagnostics.contrasts.every(({ passes }) => passes)).toBe(true);
    expect(palette.colorDiagnostics.surfaceSeparation.length).toBeGreaterThan(0);
  }
});

it('reports neutral and surface-separation evidence without hiding failed separation', () => {
  const palette = generatePalette(mockConfig, 'light');
  const failedSeparation = palette.colorDiagnostics.surfaceSeparation.find(({ passes }) => !passes);

  expect(palette.colorDiagnostics.generated.neutral.neutralKeyColor).toBe(
    palette.swatches.neutral[500],
  );
  expect(palette.colorDiagnostics.generated.neutral.diagnostics.isUsable).toBeBoolean();
  expect(failedSeparation).toBeDefined();
  expect(failedSeparation?.contrast).toBeLessThan(failedSeparation?.minimumContrast ?? 0);
});

it('preserves owner diagnostics for achromatic and low-chroma inputs', () => {
  const achromaticConfig: ThemeConfig = {
    ...mockConfig,
    light: { primaryColor: '#777777', harmony: 'square' },
  };
  const palette = generatePalette(achromaticConfig, 'light');

  expect(palette.colorDiagnostics.generated.harmonyRoleColors.diagnostics.isHueReliable).toBe(
    false,
  );
  expect(
    palette.colorDiagnostics.generated.harmonyRoleColors.diagnostics.warnings.length,
  ).toBeGreaterThan(0);
  expect(palette.colorDiagnostics.generated.neutral.diagnostics).toBeDefined();
});

it('generates ordinal chromatic role swatches (no accent/highlight as swatch keys)', () => {
  const { swatches } = generatePalette(mockConfig, 'light');
  const keys = Object.keys(swatches);
  expect(keys).not.toContain('accent');
  expect(keys).not.toContain('highlight');
  expect(keys).not.toContain('surfaceTint');
  expect(keys).not.toContain('base');
  // ordinal roles are present
  expect(keys).toContain('primary');
  expect(keys).toContain('neutral');
});

it('semantic resolver maps all SemanticColorToken entries for light mode', () => {
  const { swatches } = generatePalette(mockConfig, 'light');
  // Build a minimal GeneratedThemeModeColors for resolver testing
  const generated = {
    harmonyRoleColors: {} as never,
    swatches,
    neutral: { neutralKeyColor: swatches.neutral[500], diagnostics: {} as never },
  };
  const resolved = resolveSemanticColors(generated, LIGHT_SEMANTIC_COLOR_REFERENCES);
  const tokens: SemanticColorToken[] = [
    'background',
    'surface',
    'surfaceRaised',
    'border',
    'divider',
    'text',
    'textMuted',
    'disabledBg',
    'disabledText',
    'brand',
    'brandEmphasis',
    'action',
    'actionEmphasis',
  ];
  for (const token of tokens) {
    expect(readOwnProperty(resolved, token)).toBeDefined();
    expect(typeof readOwnProperty(resolved, token)).toBe('string');
  }
});

it('semantic resolver maps all SemanticColorToken entries for dark mode', () => {
  const { swatches } = generatePalette(mockConfig, 'dark');
  const generated = {
    harmonyRoleColors: {} as never,
    swatches,
    neutral: { neutralKeyColor: swatches.neutral[500], diagnostics: {} as never },
  };
  const resolved = resolveSemanticColors(generated, DARK_SEMANTIC_COLOR_REFERENCES);
  const tokens: SemanticColorToken[] = [
    'background',
    'surface',
    'surfaceRaised',
    'border',
    'divider',
    'text',
    'textMuted',
    'disabledBg',
    'disabledText',
    'brand',
    'brandEmphasis',
    'action',
    'actionEmphasis',
  ];
  for (const token of tokens) {
    expect(readOwnProperty(resolved, token)).toBeDefined();
  }
});

it('neutral semantics power backgrounds, borders, text in light mode', () => {
  const { semantics } = generatePalette(mockConfig, 'light');
  expect(semantics.neutral.bg).toBeDefined();
  expect(semantics.neutral.bgSubtle).toBeDefined();
  expect(semantics.neutral.surface).toBeDefined();
  expect(semantics.neutral.surfaceHover).toBeDefined();
  expect(semantics.neutral.border).toBeDefined();
  expect(semantics.neutral.borderStrong).toBeDefined();
  expect(semantics.neutral.divider).toBeDefined();
  expect(semantics.neutral.text).toBeDefined();
  expect(semantics.neutral.textMuted).toBeDefined();
  expect(semantics.neutral.textSubtle).toBeDefined();
});

it('readable foregrounds are generated for brand base in both modes', () => {
  const light = generatePalette(mockConfig, 'light');
  const dark = generatePalette(mockConfig, 'dark');
  expect(light.semantics.brand.onSolidText).toMatch(/^#/);
  expect(dark.semantics.brand.onSolidText).toMatch(/^#/);
});
