import type { ImageSourcePropType } from 'react-native';

/*** Chooses the primary or fallback normalized image source. */
export function resolveRenderedSource(
  normalizedPrimary: ImageSourcePropType | undefined,
  normalizedFallback: ImageSourcePropType | undefined,
  showFallback: boolean,
): ImageSourcePropType | undefined {
  if (showFallback || !normalizedPrimary) return normalizedFallback;
  return normalizedPrimary;
}
