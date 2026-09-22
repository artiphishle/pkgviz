import React from 'react';
import {
  Platform,
  type StyleProp,
  TextInput as ReactNativeTextInput,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

import { resolveFocusRingStyles } from '../../../../../internal/resolvers';
import type { TextInputProps } from '../../../../../types/text-input';
import { useTheme } from '../../../../theme/runtime';
import { resolveTextInputPresentation } from '../../utils/resolveTextInputPresentation';

/*** Renders a token-aware text input with controlled interaction policy. */
export function TextInput(props: TextInputProps) {
  const { theme } = useTheme();
  const [focused, setFocused] = React.useState(false);
  const {
    disabled: _disabled,
    interactionPolicy = 'enabled',
    invalid: _invalid,
    leadingAccessory,
    readOnly = false,
    size: _size,
    trailingAccessory,
    ...nativeProps
  } = props;
  const presentation = resolveTextInputPresentation(theme, props, focused);

  return (
    <View
      style={[
        presentation.containerStyle,
        resolveFocusRingStyles(theme.semantics.border.focus, focused, Platform.OS === 'web'),
      ]}
    >
      {renderAccessory(leadingAccessory, presentation.accessorySpacing, 'leading')}
      <ReactNativeTextInput
        {...nativeProps}
        editable={presentation.editable}
        numberOfLines={presentation.numberOfLines}
        onBlur={(event) => {
          setFocused(false);
          nativeProps.onBlur?.(event);
        }}
        onChangeText={(nextValue) => {
          if (interactionPolicy !== 'passive') nativeProps.onChangeText?.(nextValue);
        }}
        onFocus={(event) => {
          setFocused(true);
          nativeProps.onFocus?.(event);
        }}
        placeholderTextColor={presentation.placeholderColor}
        readOnly={readOnly}
        style={resolveInputStyle(presentation.inputStyle, nativeProps.multiline, nativeProps.style)}
      />
      {renderAccessory(trailingAccessory, presentation.accessorySpacing, 'trailing')}
    </View>
  );
}

const multilineInputStyle: TextStyle = { textAlignVertical: 'top' };

/*** Resolves TextInput style composition including canonical multiline alignment. */
function resolveInputStyle(
  presentationStyle: StyleProp<TextStyle>,
  multiline: boolean | undefined,
  style: StyleProp<TextStyle>,
): StyleProp<TextStyle> {
  return [presentationStyle, multiline ? multilineInputStyle : undefined, style];
}

/*** Renders one optional TextInput accessory with directional spacing. */
function renderAccessory(
  accessory: React.ReactNode,
  spacing: number,
  position: 'leading' | 'trailing',
) {
  if (!accessory) return null;
  return <View style={resolveAccessoryStyle(spacing, position)}>{accessory}</View>;
}

/*** Resolves spacing around a leading or trailing TextInput accessory. */
function resolveAccessoryStyle(spacing: number, position: 'leading' | 'trailing'): ViewStyle {
  return position === 'leading' ? { marginRight: spacing } : { marginLeft: spacing };
}
