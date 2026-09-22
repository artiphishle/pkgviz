import type { TextStyle } from 'react-native';

import type { FontWeight, SurfaceTheme } from '../../types/theme';

export type TextVariant = 'body' | 'bodySmall' | 'caption' | 'label' | 'mono';
export type TextWeight = keyof SurfaceTheme['typography']['weights'] | FontWeight;

interface VariantStyle {
  fontSize: number;
  lineHeight: number;
  weight: TextWeight;
}

export interface ResolveTextStyleOptions {
  variant?: TextVariant;
  align?: TextStyle['textAlign'];
  weight?: TextWeight;
  italic?: boolean;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

function resolveWeight(theme: SurfaceTheme, value: TextWeight | undefined): FontWeight {
  if (!value) return theme.typography.weights.regular;
  if (value in theme.typography.weights) {
    return theme.typography.weights[value as keyof SurfaceTheme['typography']['weights']];
  }
  return value as FontWeight;
}

function getVariantStyle(theme: SurfaceTheme, variant: TextVariant): VariantStyle {
  switch (variant) {
    case 'bodySmall':
      return {
        fontSize: theme.typography.sizes.s,
        lineHeight: 20,
        weight: 'regular',
      };
    case 'caption':
      return {
        fontSize: theme.typography.sizes.xs,
        lineHeight: 16,
        weight: 'regular',
      };
    case 'label':
      return {
        fontSize: theme.typography.sizes.s,
        lineHeight: 18,
        weight: 'medium',
      };
    case 'mono':
      return {
        fontSize: theme.typography.sizes.s,
        lineHeight: 20,
        weight: 'regular',
      };
    case 'body':
    default:
      return {
        fontSize: theme.typography.sizes.m,
        lineHeight: 24,
        weight: 'regular',
      };
  }
}

export function resolveTextStyles(
  theme: SurfaceTheme,
  options: ResolveTextStyleOptions = {},
): TextStyle {
  const { level, variant = 'body', align, weight, italic = false } = options;
  const headingTypography = level ? theme.typography.headings[level] : null;
  const variantStyle = headingTypography
    ? {
        fontSize: headingTypography.size,
        lineHeight: headingTypography.lineHeight,
        weight: headingTypography.weight,
      }
    : getVariantStyle(theme, variant);

  const resolvedWeight = resolveWeight(theme, weight ?? variantStyle.weight);
  const isMono = !level && variant === 'mono';
  const fontFamily = isMono
    ? 'monospace'
    : theme.typography.fonts[italic ? 'italic' : 'normal'][resolvedWeight];

  return {
    fontSize: variantStyle.fontSize,
    lineHeight: variantStyle.lineHeight,
    fontWeight: resolvedWeight,
    fontFamily,
    fontStyle: italic ? 'italic' : 'normal',
    textAlign: align,
    elevation: 0,
  };
}
