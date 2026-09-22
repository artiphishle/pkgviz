import type { ImageSourcePropType } from 'react-native';

import type { SurfaceImageSource } from '../../../types/image';

/*** Derives a stable runtime key for one Surface image source. */
export function getSourceKey(source: SurfaceImageSource | null | undefined): string | null {
  if (source === null || source === undefined) return null;
  if (typeof source === 'string') return `uri:${source}`;
  if (typeof source === 'number') return `asset:${source}`;
  if (Array.isArray(source)) {
    const parts = source
      .map((item) => item.uri)
      .filter((value): value is string => typeof value === 'string');
    return `uri-set:${parts.join('|')}`;
  }

  const uri = getUriFromSource(source);
  if (uri) return `uri:${uri}`;

  try {
    return `src:${JSON.stringify(source)}`;
  } catch {
    return 'src:unknown';
  }
}

/*** Reads the first URI represented by a React Native image source. */
function getUriFromSource(source: ImageSourcePropType): string | undefined {
  if (Array.isArray(source)) return source[0]?.uri;
  if (typeof source === 'number') return undefined;
  return source.uri;
}
