import type { ThemeConfig } from '@ankhorage/contracts';

import type { FontWeight, SurfaceTheme } from '../../../../types/theme';
import { generatePalette } from '../../domain/generatePalette';
import { resolveGlobalTokens } from '../../utils/resolveGlobalTokens';

const DEFAULT_CONFIG: ThemeConfig = {
  id: 'default',
  name: 'Default',
  light: { primaryColor: '#3B82F6', harmony: 'monochromatic' },
  dark: { primaryColor: '#3B82F6', harmony: 'monochromatic' },
};

/*** Resolve canonical persisted theme source into the complete Surface runtime theme. */
export function createTheme(
  config: ThemeConfig = DEFAULT_CONFIG,
  mode: 'light' | 'dark' = 'light',
  activeFontId?: string | null,
): SurfaceTheme {
  const { colors, swatches, semantics, colorDiagnostics } = generatePalette(config, mode);
  const baseTheme: SurfaceTheme = {
    ...resolveGlobalTokens(config.tokens),
    colors,
    swatches,
    semantics,
    colorDiagnostics,
    config,
  };
  return activeFontId ? withActiveFont(baseTheme, activeFontId) : baseTheme;
}

/*** Return a theme with generated module font-family names without mutating the base theme. */
function withActiveFont(theme: SurfaceTheme, activeFontId: string): SurfaceTheme {
  const familyName = toPascalCase(activeFontId);
  return {
    ...theme,
    typography: {
      ...theme.typography,
      fonts: {
        normal: createFontMap(theme.typography.fonts.normal, familyName, 'Regular'),
        italic: createFontMap(theme.typography.fonts.italic, familyName, 'Italic'),
      },
    },
  };
}

function createFontMap(
  fallback: Record<FontWeight, string | undefined>,
  familyName: string,
  style: 'Regular' | 'Italic',
): Record<FontWeight, string | undefined> {
  return {
    ...fallback,
    '100': `${familyName}_100${style}`,
    '200': `${familyName}_200${style}`,
    '300': `${familyName}_300${style}`,
    '400': `${familyName}_400${style}`,
    '500': `${familyName}_500${style}`,
    '600': `${familyName}_600${style}`,
    '700': `${familyName}_700${style}`,
    '800': `${familyName}_800${style}`,
    '900': `${familyName}_900${style}`,
  };
}

function toPascalCase(value: string): string {
  return value
    .split(/[- ]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}
