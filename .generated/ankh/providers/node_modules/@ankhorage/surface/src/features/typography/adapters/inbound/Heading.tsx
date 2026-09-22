import React from 'react';
import { Text as ReactNativeText } from 'react-native';

import type { HeadingProps } from '../../../../types/typography';
import { useTheme } from '../../../theme/runtime';
import { resolveHeadingTextStyle } from '../../utils/resolveHeadingTextStyle';

/*** Renders a semantic heading using Surface typography tokens. */
export function Heading({
  text,
  children,
  level = 2,
  align,
  color,
  emphasis = 'default',
  numberOfLines,
  testID,
}: HeadingProps) {
  const { theme } = useTheme();
  const content = text ?? children;

  return (
    <ReactNativeText
      accessibilityRole="header"
      testID={testID}
      numberOfLines={numberOfLines}
      style={resolveHeadingTextStyle(theme, level, align, emphasis, color)}
    >
      {content}
    </ReactNativeText>
  );
}
