import React from 'react';
import type { ViewStyle } from 'react-native';

import {
  type InteractionState,
  resolveFieldState,
  resolveIndicatorSize,
  resolveSelectionControlColors,
  resolveSelectionControlNextChecked,
} from '../../../../../internal/resolvers';
import { useControllableState } from '../../../../../internal/useControllableState';
import type { RadioProps } from '../../../../../types/radio';
import type { SurfaceTheme } from '../../../../../types/theme';
import { View } from '../../../../layout/public';
import type { PressableProps } from '../../../../pressable/public';
import { Pressable } from '../../../../pressable/public';
import { useTheme } from '../../../../theme/runtime';
import { Text } from '../../../../typography/public';
import { isRadioTextContent } from '../../utils/isRadioTextContent';

/*** Renders one accessible radio control with text or structured label content. */
export function Radio({
  accessibilityLabel,
  checked,
  children,
  color = 'primary',
  defaultChecked = false,
  disabled = false,
  invalid = false,
  onCheckedChange,
  readOnly = false,
  size = 'm',
  testID,
  ...buttonProps
}: RadioProps) {
  const { theme } = useTheme();
  const [isChecked, setChecked] = useControllableState<boolean>({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  return (
    <RadioControl
      accessibilityLabel={accessibilityLabel}
      buttonProps={buttonProps}
      color={color}
      disabled={disabled}
      invalid={invalid}
      isChecked={isChecked}
      readOnly={readOnly}
      setChecked={setChecked}
      size={size}
      testID={testID}
      theme={theme}
    >
      {children}
    </RadioControl>
  );
}

/*** Owns the radio interaction boundary around resolved selection content. */
function RadioControl({
  accessibilityLabel,
  buttonProps,
  children,
  color,
  disabled,
  invalid,
  isChecked,
  readOnly,
  setChecked,
  size,
  testID,
  theme,
}: RadioControlProps) {
  const nextChecked = resolveSelectionControlNextChecked({
    checked: isChecked,
    disabled,
    kind: 'radio',
    readOnly,
  });

  return (
    <Pressable
      {...buttonProps}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="radio"
      accessibilityState={{ checked: isChecked }}
      disabled={disabled}
      onPress={nextChecked === null ? undefined : () => setChecked(nextChecked)}
      testID={testID}
    >
      {(interactionState) =>
        renderRadioContent({
          children,
          color,
          disabled,
          interactionState,
          invalid,
          isChecked,
          readOnly,
          size,
          theme,
        })
      }
    </Pressable>
  );
}

/*** Renders the radio indicator and optional content for one interaction state. */
function renderRadioContent(input: RadioContentInput) {
  const { interactionState, theme } = input;
  const fieldState = resolveFieldState({
    disabled: input.disabled,
    focused: interactionState.focused,
    invalid: input.invalid,
    readOnly: input.readOnly,
  });
  const colors = resolveSelectionControlColors(theme, {
    checked: input.isChecked,
    fieldState,
    hovered: interactionState.hovered,
    pressed: interactionState.pressed,
    color: input.color,
  });
  const indicatorSize = resolveIndicatorSize(input.size);
  const labelEmphasis = colors.labelColor === theme.semantics.content.muted ? 'muted' : 'default';
  const hasContent =
    input.children !== undefined && input.children !== null && input.children !== false;

  return (
    <View style={resolveSelectionRowStyle(colors.opacity)}>
      <View
        radius="full"
        style={resolveRadioIndicatorStyle(
          colors.backgroundColor,
          colors.borderColor,
          indicatorSize.radio,
        )}
      >
        {input.isChecked ? (
          <View
            radius="full"
            style={resolveRadioDotStyle(colors.indicatorColor, indicatorSize.radioDot)}
          />
        ) : null}
      </View>
      {hasContent ? (
        <View flex={1} ml="s">
          {isRadioTextContent(input.children) ? (
            <Text emphasis={labelEmphasis}>{input.children}</Text>
          ) : (
            input.children
          )}
        </View>
      ) : null}
    </View>
  );
}

/*** Resolves the horizontal selection-control row style. */
function resolveSelectionRowStyle(opacity: number | undefined): ViewStyle {
  return { alignItems: 'center', flexDirection: 'row', opacity };
}

/*** Resolves radio indicator dimensions and interaction colors. */
function resolveRadioIndicatorStyle(
  backgroundColor: string,
  borderColor: string,
  size: number,
): ViewStyle {
  return {
    alignItems: 'center',
    backgroundColor,
    borderColor,
    borderWidth: 1.5,
    height: size,
    justifyContent: 'center',
    width: size,
  };
}

/*** Resolves the checked radio dot style. */
function resolveRadioDotStyle(backgroundColor: string, size: number): ViewStyle {
  return { backgroundColor, height: size, width: size };
}

interface RadioControlProps {
  accessibilityLabel: RadioProps['accessibilityLabel'];
  buttonProps: PressableProps;
  children: RadioProps['children'];
  color: NonNullable<RadioProps['color']>;
  disabled: boolean;
  invalid: boolean;
  isChecked: boolean;
  readOnly: boolean;
  setChecked: (checked: boolean) => void;
  size: NonNullable<RadioProps['size']>;
  testID: RadioProps['testID'];
  theme: SurfaceTheme;
}

interface RadioContentInput {
  children: RadioProps['children'];
  color: NonNullable<RadioProps['color']>;
  disabled: boolean;
  interactionState: InteractionState;
  invalid: boolean;
  isChecked: boolean;
  readOnly: boolean;
  size: NonNullable<RadioProps['size']>;
  theme: SurfaceTheme;
}
