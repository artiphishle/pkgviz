import React from 'react';
import { Image as ReactNativeImage } from 'react-native';

import type { ImageProps } from '../../../../types/image';
import { useTheme } from '../../../theme/runtime';
import { getSourceKey } from '../../utils/getSourceKey';
import { normalizeSource } from '../../utils/normalizeSource';
import { resolveAccessibilityLabel } from '../../utils/resolveAccessibilityLabel';
import { resolveAlt } from '../../utils/resolveAlt';
import { resolveImageStyle } from '../../utils/resolveImageStyle';
import { resolveRenderedSource } from '../../utils/resolveRenderedSource';
import { resolveResizeMode } from '../../utils/resolveResizeMode';

/*** Renders a token-aware accessible image with optional fallback source. */
export function Image({
  source,
  fallbackSource,
  alt,
  accessibilityLabel,
  width,
  height,
  aspectRatio,
  fit,
  resizeMode,
  radius,
  style,
  testID,
  onError,
}: ImageProps) {
  const { theme } = useTheme();
  const primaryKey = React.useMemo(() => getSourceKey(source), [source]);
  const [failedPrimaryKey, setFailedPrimaryKey] = React.useState<string | null>(null);
  const showFallback = primaryKey !== null && failedPrimaryKey === primaryKey;
  const normalizedPrimary = normalizeSource(source);
  const normalizedFallback = normalizeSource(fallbackSource);
  const resolvedSource = resolveRenderedSource(normalizedPrimary, normalizedFallback, showFallback);

  if (!resolvedSource) return null;

  return (
    <ReactNativeImage
      accessibilityLabel={resolveAccessibilityLabel(alt, accessibilityLabel)}
      accessibilityRole="image"
      alt={resolveAlt(alt, accessibilityLabel)}
      onError={(event) => {
        onError?.(event);
        if (!showFallback && normalizedFallback) setFailedPrimaryKey(primaryKey);
      }}
      resizeMode={resolveResizeMode(fit, resizeMode)}
      source={resolvedSource}
      style={[resolveImageStyle(theme, { width, height, aspectRatio, radius }), style]}
      testID={testID}
    />
  );
}
