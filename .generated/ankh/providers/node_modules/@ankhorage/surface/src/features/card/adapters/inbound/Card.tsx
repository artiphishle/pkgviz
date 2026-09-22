import React from 'react';
import type { ViewStyle } from 'react-native';

import type { CardProps } from '../../../../types/card';
import type { SurfaceVariant } from '../../../../types/surface';
import { Pressable } from '../../../pressable/public';
import { Surface } from '../../../surface/public';
import { useTheme } from '../../../theme/runtime';

/*** Renders a themed content card with optional interactive press states. */
export function Card({
  children,
  variant = 'default',
  onPress,
  disabled = false,
  testID,
  style,
  ...props
}: CardProps) {
  const { theme } = useTheme();

  if (!onPress) {
    return (
      <Surface {...props} style={style} testID={testID} variant={variant}>
        {children}
      </Surface>
    );
  }

  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} testID={testID}>
      {(state) => (
        <Surface
          {...props}
          style={[
            resolveInteractiveCardStyle(variant, state.pressed, state.hovered, state.disabled, {
              active: theme.semantics.neutral.surfaceActive,
              base: theme.semantics.surface.default,
              hover: theme.semantics.neutral.surfaceHover,
              subtle: theme.semantics.surface.subtle,
            }),
            style,
          ]}
          variant={variant}
        >
          {children}
        </Surface>
      )}
    </Pressable>
  );
}

/*** Resolves the complete interactive style for one Card state. */
function resolveInteractiveCardStyle(
  variant: SurfaceVariant,
  pressed: boolean,
  hovered: boolean,
  disabled: boolean,
  backgrounds: CardBackgrounds,
): ViewStyle {
  return {
    backgroundColor: resolveCardStateBackground(variant, pressed, hovered, backgrounds),
    opacity: disabled ? 0.72 : 1,
  };
}

/*** Resolves the interactive background for one Card variant and state. */
function resolveCardStateBackground(
  variant: SurfaceVariant,
  pressed: boolean,
  hovered: boolean,
  backgrounds: CardBackgrounds,
) {
  if (variant === 'outline') {
    return pressed ? backgrounds.active : hovered ? backgrounds.hover : 'transparent';
  }
  if (variant === 'subtle') {
    return pressed ? backgrounds.active : hovered ? backgrounds.hover : backgrounds.subtle;
  }
  return pressed ? backgrounds.active : hovered ? backgrounds.hover : backgrounds.base;
}

interface CardBackgrounds {
  active: string;
  base: string;
  hover: string;
  subtle: string;
}
