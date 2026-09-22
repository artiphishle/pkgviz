import type { ImageSourcePropType } from 'react-native';

import type { SurfaceImageSource } from '../../../types/image';

/*** Normalizes a Surface image source into React Native's source shape. */
export function normalizeSource(
  source: SurfaceImageSource | null | undefined,
): ImageSourcePropType | undefined {
  if (source === null || source === undefined) return undefined;
  if (typeof source === 'string') return { uri: source };
  return source;
}
