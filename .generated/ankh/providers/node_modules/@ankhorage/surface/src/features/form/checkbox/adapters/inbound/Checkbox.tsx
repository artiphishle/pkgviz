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
import type { CheckboxProps } from '../../../../../types/checkbox';
import type { SurfaceTheme } from '../../../../../types/theme';
import { View } from '../../../../layout/public';
import type { PressableProps } from '../../../../pressable/public';
import { Pressable } from '../../../../pressable/public';
import { useTheme } from '../../../../theme/runtime';
import { Text } from '../../../../typography/public';

/*** Renders a controlled or uncontrolled accessible checkbox. */
export function Checkbox({
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
}: CheckboxProps) {
  const { theme } = useTheme();
  const [isChecked, setChecked] = useControllableState<boolean>({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  return (
    <CheckboxControl
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
    </CheckboxControl>
  );
}

/*** Owns the checkbox interaction boundary around resolved selection content. */
function CheckboxControl({
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
}: CheckboxControlProps) {
  const nextChecked = resolveSelectionControlNextChecked({
    checked: isChecked,
    disabled,
    kind: 'checkbox',
    readOnly,
  });

  return (
    <Pressable
      {...buttonProps}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked }}
      disabled={disabled}
      onPress={nextChecked === null ? undefined : () => setChecked(nextChecked)}
      testID={testID}
    >
      {(interactionState) =>
        renderCheckboxContent({
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

/*** Renders the checkbox indicator and optional label for one interaction state. */
function renderCheckboxContent(input: CheckboxContentInput) {
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
  const indicatorColor = fieldState.invalid ? 'error' : input.color;

  return (
    <View style={resolveSelectionRowStyle(colors.opacity)}>
      <View
        radius="s"
        style={resolveCheckboxIndicatorStyle(
          colors.backgroundColor,
          colors.borderColor,
          indicatorSize.checkbox,
        )}
      >
        {input.isChecked ? (
          <Text
            color={input.disabled ? undefined : indicatorColor}
            emphasis={input.disabled ? 'muted' : 'inverse'}
            variant="caption"
            weight="bold"
          >
            ✓
          </Text>
        ) : null}
      </View>
      {input.children ? (
        <View ml="s">
          <Text emphasis={labelEmphasis}>{input.children}</Text>
        </View>
      ) : null}
    </View>
  );
}

/*** Resolves the horizontal selection-control row style. */
function resolveSelectionRowStyle(opacity: number | undefined): ViewStyle {
  return { alignItems: 'center', flexDirection: 'row', opacity };
}

/*** Resolves checkbox indicator dimensions and interaction colors. */
function resolveCheckboxIndicatorStyle(
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

interface CheckboxControlProps {
  accessibilityLabel: CheckboxProps['accessibilityLabel'];
  buttonProps: PressableProps;
  children: CheckboxProps['children'];
  color: NonNullable<CheckboxProps['color']>;
  disabled: boolean;
  invalid: boolean;
  isChecked: boolean;
  readOnly: boolean;
  setChecked: (checked: boolean) => void;
  size: NonNullable<CheckboxProps['size']>;
  testID: CheckboxProps['testID'];
  theme: SurfaceTheme;
}

interface CheckboxContentInput {
  children: CheckboxProps['children'];
  color: NonNullable<CheckboxProps['color']>;
  disabled: boolean;
  interactionState: InteractionState;
  invalid: boolean;
  isChecked: boolean;
  readOnly: boolean;
  size: NonNullable<CheckboxProps['size']>;
  theme: SurfaceTheme;
}
