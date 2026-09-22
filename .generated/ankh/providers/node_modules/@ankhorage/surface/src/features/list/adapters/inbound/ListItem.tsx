import React from 'react';

import type { ListItemProps } from '../../../../types/list';
import type { SurfaceTheme } from '../../../../types/theme';
import { View } from '../../../layout/public';
import { Pressable } from '../../../pressable/public';
import { useTheme } from '../../../theme/runtime';
import { Text } from '../../../typography/public';

/*** Renders a static or interactive list item with shared row geometry and interaction states. */
export function ListItem(props: ListItemProps) {
  const { theme } = useTheme();
  if (!props.onPress) return renderStaticListItem(props, theme);
  return renderInteractiveListItem({ ...props, onPress: props.onPress }, theme);
}

/*** Renders a non-pressable list item. */
function renderStaticListItem(props: ListItemProps, theme: SurfaceTheme) {
  return (
    <ListItemContent
      {...props}
      backgroundColor={props.selected ? theme.semantics.selection.background : 'transparent'}
    />
  );
}

/*** Renders a pressable list item with shared interaction-state presentation. */
function renderInteractiveListItem(
  props: ListItemProps & { onPress: NonNullable<ListItemProps['onPress']> },
  theme: SurfaceTheme,
) {
  return (
    <Pressable
      accessibilityLabel={props.accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: props.disabled ?? false, selected: props.selected ?? false }}
      disabled={props.disabled ?? false}
      interactionPolicy={props.interactionPolicy}
      onPress={props.onPress}
      testID={props.testID}
    >
      {(state) => (
        <ListItemContent
          {...props}
          backgroundColor={resolveListItemBackground(theme, {
            hovered: state.hovered,
            pressed: state.pressed,
            selected: props.selected ?? false,
          })}
          disabled={state.disabled}
          testID={undefined}
        />
      )}
    </Pressable>
  );
}

interface ListItemBackgroundState {
  hovered: boolean;
  pressed: boolean;
  selected: boolean;
}

type ListItemContentProps = Omit<
  ListItemProps,
  'accessibilityLabel' | 'interactionPolicy' | 'onPress' | 'selected'
> & {
  backgroundColor: string;
};

/*** Resolves the neutral list-item background for one interaction state. */
function resolveListItemBackground(theme: SurfaceTheme, state: ListItemBackgroundState) {
  if (state.pressed) return theme.semantics.neutral.surfaceActive;
  if (state.hovered) return theme.semantics.neutral.surfaceHover;
  if (state.selected) return theme.semantics.selection.background;
  return 'transparent';
}

/*** Renders the shared visual row content for static and interactive list items. */
function ListItemContent({
  backgroundColor,
  children,
  compact = false,
  description,
  disabled = false,
  leading,
  testID,
  title,
  trailing,
}: ListItemContentProps) {
  const content = children ?? renderDefaultContent(title, description);

  return (
    <View
      align="center"
      bg={backgroundColor}
      direction="row"
      gap="m"
      opacity={disabled ? 0.72 : 1}
      px="m"
      py={compact ? 's' : 'm'}
      testID={testID}
    >
      {leading !== undefined ? <View>{leading}</View> : null}
      <View flex={1}>{content}</View>
      {trailing !== undefined ? <View>{trailing}</View> : null}
    </View>
  );
}

/*** Renders the default title and description content when custom children are absent. */
function renderDefaultContent(title: React.ReactNode, description: React.ReactNode) {
  if (title === undefined && description === undefined) return null;
  return (
    <View flex={1} gap="xs">
      {title !== undefined ? (
        <Text numberOfLines={1} variant="body" weight="medium">
          {title}
        </Text>
      ) : null}
      {description !== undefined ? (
        <Text emphasis="muted" numberOfLines={2} variant="bodySmall">
          {description}
        </Text>
      ) : null}
    </View>
  );
}
