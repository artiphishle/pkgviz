import React from 'react';
import type { ViewStyle } from 'react-native';

import type { SurfaceProps, SurfaceVariant } from '../../../../types/surface';
import { View } from '../../../layout/public';
import { useTheme } from '../../../theme/runtime';

/*** Renders a themed content surface with semantic elevation and border variants. */
export function Surface({ variant = 'default', radius = 'm', style, ...props }: SurfaceProps) {
  const { theme } = useTheme();
  const backgroundColor =
    variant === 'subtle'
      ? theme.semantics.surface.subtle
      : variant === 'raised'
        ? theme.semantics.surface.raised
        : theme.semantics.surface.default;
  const borderColor = theme.semantics.border.default;

  return (
    <View
      {...props}
      radius={radius}
      style={[resolveSurfaceVariantStyles(variant, borderColor, backgroundColor), style]}
    />
  );
}

/*** Resolves the semantic visual treatment for one Surface variant. */
function resolveSurfaceVariantStyles(
  variant: SurfaceVariant,
  borderColor: string,
  backgroundColor: string,
): ViewStyle {
  switch (variant) {
    case 'subtle':
      return { backgroundColor, borderColor: 'transparent', borderWidth: 0 };
    case 'raised':
      return {
        backgroundColor,
        borderColor: 'transparent',
        borderWidth: 0,
        elevation: 2,
        shadowColor: '#000000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
      };
    case 'outline':
      return { backgroundColor: 'transparent', borderColor, borderWidth: 1 };
    case 'default':
      return { backgroundColor, borderColor, borderWidth: 1 };
  }
}
