import type { SurfaceTheme } from '../../types/theme';

export type ControlSize = 's' | 'm' | 'l';

export interface ResolvedControlSize {
  minHeight: number;
  paddingHorizontal: number;
  paddingVertical: number;
  borderRadius: number;
  textVariant: 'bodySmall' | 'body';
  iconSize: number;
}

export function resolveControlSize(
  theme: SurfaceTheme,
  size: ControlSize = 'm',
): ResolvedControlSize {
  switch (size) {
    case 's':
      return {
        minHeight: 32,
        paddingHorizontal: theme.spacing.s,
        paddingVertical: 6,
        borderRadius: theme.radii.m,
        textVariant: 'bodySmall',
        iconSize: 16,
      };
    case 'l':
      return {
        minHeight: 48,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: theme.radii.l,
        textVariant: 'body',
        iconSize: 20,
      };
    case 'm':
    default:
      return {
        minHeight: 40,
        paddingHorizontal: theme.spacing.m,
        paddingVertical: 8,
        borderRadius: theme.radii.m,
        textVariant: 'body',
        iconSize: 18,
      };
  }
}
