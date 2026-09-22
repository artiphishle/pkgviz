import type { ImageProps } from '../../../types/image';

/*** Resolves web alt text from alt or the accessible label. */
export function resolveAlt(
  alt: ImageProps['alt'],
  accessibilityLabel: ImageProps['accessibilityLabel'],
): string | undefined {
  return alt ?? accessibilityLabel;
}
