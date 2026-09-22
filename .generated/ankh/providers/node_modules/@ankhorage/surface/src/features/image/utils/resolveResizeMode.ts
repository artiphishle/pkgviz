import type { ImageResizeMode } from 'react-native';

import type { ImageProps } from '../../../types/image';

/*** Resolves the canonical resize mode, preferring the Surface fit alias. */
export function resolveResizeMode(
  fit: ImageProps['fit'],
  resizeMode: ImageProps['resizeMode'],
): ImageResizeMode {
  return fit ?? resizeMode ?? 'cover';
}
