import type { TextStyle, ViewStyle } from 'react-native';

import {
  resolveControlSize,
  resolveFieldState,
  resolveInputColors,
  resolveTextStyles,
} from '../../../../internal/resolvers';
import type { TextInputProps } from '../../../../types/text-input';
import type { SurfaceTheme } from '../../../../types/theme';

/*** Resolves layout, colors, and editability for one TextInput state. */
export function resolveTextInputPresentation(
  theme: SurfaceTheme,
  props: TextInputProps,
  focused: boolean,
): TextInputPresentation {
  const controlSize = resolveControlSize(theme, props.size ?? 'm');
  const disabled = props.disabled ?? false;
  const readOnly = props.readOnly ?? false;
  const fieldState = resolveFieldState({
    disabled,
    focused,
    invalid: props.invalid ?? false,
    readOnly,
  });
  const colors = resolveInputColors(theme, fieldState);
  const textStyle = resolveTextStyles(theme, { variant: controlSize.textVariant });
  const heights = resolveTextInputHeights(
    controlSize,
    props.multiline,
    props.numberOfLines,
    textStyle.lineHeight,
  );

  return {
    accessorySpacing: theme.spacing.s,
    containerStyle: {
      alignItems: props.multiline ? 'flex-start' : 'center',
      backgroundColor: colors.backgroundColor,
      borderColor: colors.borderColor,
      borderRadius: controlSize.borderRadius,
      borderWidth: 1,
      flexDirection: 'row',
      minHeight: heights.container,
      opacity: colors.opacity,
      paddingHorizontal: controlSize.paddingHorizontal,
      paddingVertical: controlSize.paddingVertical,
    },
    editable: props.interactionPolicy === 'passive' ? false : !disabled && !readOnly,
    inputStyle: {
      color: colors.contentColor,
      flex: 1,
      minHeight: heights.input,
      padding: 0,
      textAlignVertical: props.multiline ? 'top' : 'center',
    },
    numberOfLines: props.multiline ? props.numberOfLines : 1,
    placeholderColor: colors.placeholderColor,
  };
}

/*** Resolves input and container heights from control typography and multiline state. */
function resolveTextInputHeights(
  controlSize: ReturnType<typeof resolveControlSize>,
  multiline: boolean | undefined,
  numberOfLines: number | undefined,
  lineHeight: TextStyle['lineHeight'],
) {
  const resolvedLineHeight =
    typeof lineHeight === 'number'
      ? lineHeight
      : controlSize.minHeight - controlSize.paddingVertical * 2;
  const lineCount = Math.max(numberOfLines ?? 1, 1);
  const input = multiline
    ? resolvedLineHeight * lineCount
    : controlSize.minHeight - controlSize.paddingVertical * 2;
  return {
    input,
    container: multiline ? input + controlSize.paddingVertical * 2 : controlSize.minHeight,
  };
}

interface TextInputPresentation {
  accessorySpacing: number;
  containerStyle: ViewStyle;
  editable: boolean;
  inputStyle: TextStyle;
  numberOfLines: number | undefined;
  placeholderColor: string;
}
