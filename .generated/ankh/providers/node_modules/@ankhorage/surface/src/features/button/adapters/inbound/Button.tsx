import React from 'react';
import { ActivityIndicator, View as ReactNativeView, type ViewStyle } from 'react-native';

import {
  type InteractionState,
  resolveButtonColors,
  resolveControlSize,
  resolveIconSize,
} from '../../../../internal/resolvers';
import type { ButtonProps } from '../../../../types/button';
import type { SurfaceTheme } from '../../../../types/theme';
import { Icon } from '../../../icon/public';
import { View } from '../../../layout/public';
import { Pressable } from '../../../pressable/public';
import { useTheme } from '../../../theme/runtime';
import { Text } from '../../../typography/public';

/*** Renders the primary Surface action control with semantic visual states. */
export function Button({
  children,
  variant = 'solid',
  color = 'primary',
  size = 'm',
  disabled = false,
  loading = false,
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  onPress,
  testID,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();
  const controlSize = resolveControlSize(theme, size);

  return (
    <Pressable
      {...props}
      disabled={disabled || loading}
      onPress={onPress}
      style={resolvePressableStyle(fullWidth)}
      testID={testID}
    >
      {(state) => (
        <ButtonContent
          color={color}
          controlSize={controlSize}
          fullWidth={fullWidth}
          leadingIcon={leadingIcon}
          loading={loading}
          size={size}
          state={state}
          theme={theme}
          trailingIcon={trailingIcon}
          variant={variant}
        >
          {children}
        </ButtonContent>
      )}
    </Pressable>
  );
}

/*** Renders Button content after interaction colors have been resolved. */
function ButtonContent({
  children,
  color,
  controlSize,
  fullWidth,
  leadingIcon,
  loading,
  size,
  state,
  theme,
  trailingIcon,
  variant,
}: ButtonContentProps) {
  const colors = resolveButtonColors(theme, { variant, color, state });
  const muted = colors.contentColor === theme.semantics.content.muted;
  const iconSize = resolveIconSize(theme, size);

  return (
    <View
      px={controlSize.paddingHorizontal}
      py={controlSize.paddingVertical}
      radius={controlSize.borderRadius}
      style={resolveButtonContentStyle(controlSize, colors, fullWidth, variant)}
    >
      {loading ? (
        <ActivityIndicator color={colors.contentColor} size="small" />
      ) : (
        <>
          {leadingIcon ? (
            <ReactNativeView style={resolveAccessoryStyle(theme.spacing.s, 'leading')}>
              <Icon {...leadingIcon} color={colors.contentColor} size={iconSize} />
            </ReactNativeView>
          ) : null}
          <Text
            color={muted ? undefined : color}
            emphasis={muted ? 'muted' : variant === 'solid' ? 'inverse' : 'default'}
            variant={controlSize.textVariant}
            weight="semiBold"
          >
            {children}
          </Text>
          {trailingIcon ? (
            <ReactNativeView style={resolveAccessoryStyle(theme.spacing.s, 'trailing')}>
              <Icon {...trailingIcon} color={colors.contentColor} size={iconSize} />
            </ReactNativeView>
          ) : null}
        </>
      )}
    </View>
  );
}

/*** Resolves the outer Pressable layout style. */
function resolvePressableStyle(fullWidth: boolean): ViewStyle {
  return { alignSelf: fullWidth ? 'stretch' : 'flex-start' };
}

/*** Resolves the themed Button content container style. */
function resolveButtonContentStyle(
  controlSize: ReturnType<typeof resolveControlSize>,
  colors: ReturnType<typeof resolveButtonColors>,
  fullWidth: boolean,
  variant: NonNullable<ButtonProps['variant']>,
): ViewStyle {
  return {
    alignItems: 'center',
    backgroundColor: colors.backgroundColor,
    borderColor: colors.borderColor,
    borderWidth: variant === 'solid' ? 0 : 1,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: controlSize.minHeight,
    opacity: colors.opacity,
    width: fullWidth ? '100%' : undefined,
  };
}

/*** Resolves spacing around a leading or trailing Button icon. */
function resolveAccessoryStyle(spacing: number, position: 'leading' | 'trailing'): ViewStyle {
  return position === 'leading' ? { marginRight: spacing } : { marginLeft: spacing };
}

interface ButtonContentProps {
  children: ButtonProps['children'];
  color: NonNullable<ButtonProps['color']>;
  controlSize: ReturnType<typeof resolveControlSize>;
  fullWidth: boolean;
  leadingIcon: ButtonProps['leadingIcon'];
  loading: boolean;
  size: NonNullable<ButtonProps['size']>;
  state: InteractionState;
  theme: SurfaceTheme;
  trailingIcon: ButtonProps['trailingIcon'];
  variant: NonNullable<ButtonProps['variant']>;
}
