import type { ImageStyle } from 'react-native';

import type { ImageProps } from '../../../types/image';
import type { SurfaceTheme } from '../../../types/theme';
import { resolveToken } from '../../theme/utils/resolveToken';

/*** Resolves token-aware dimensions and radius for a Surface image. */
export function resolveImageStyle(
  theme: SurfaceTheme,
  props: Pick<ImageProps, 'width' | 'height' | 'aspectRatio' | 'radius'>,
): ImageStyle {
  const width = resolveToken(theme.spacing, props.width);
  const height = resolveToken(theme.spacing, props.height);
  const borderRadius = resolveToken(theme.radii, props.radius);

  return {
    width,
    height,
    aspectRatio: props.aspectRatio,
    borderRadius,
    overflow: borderRadius !== undefined ? 'hidden' : undefined,
  };
}
