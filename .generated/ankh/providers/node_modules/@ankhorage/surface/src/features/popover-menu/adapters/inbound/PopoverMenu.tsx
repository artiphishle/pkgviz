import React from 'react';
import { Pressable } from 'react-native';

import { FocusScope } from '../../../../internal/focus/FocusScope';
import { useFocusManager } from '../../../../internal/focus/useFocusManager';
import type { PopoverMenuAction, PopoverMenuProps } from '../../../../types/popoverMenu';
import { View } from '../../../layout/public';
import { Popover } from '../../../popover/public';
import { Surface } from '../../../surface/public';
import { useTheme } from '../../../theme/runtime';
import { Text } from '../../../typography/public';
import { usePopoverMenuController } from '../../composition/usePopoverMenuController';
import { resolveNextMenuIndex } from '../../utils/resolveNextMenuIndex';

/*** Presents an anchored action menu using the shared Popover capability. */
export function PopoverMenu({
  trigger,
  actions,
  dismiss,
  closeOnSelect = true,
  interactionPolicy = 'enabled',
  testID,
}: PopoverMenuProps) {
  const passive = interactionPolicy === 'passive';
  const controller = usePopoverMenuController({ actions, closeOnSelect, dismiss, passive });

  return (
    <Popover
      anchor={trigger}
      closeOnOutsidePress
      interactionPolicy={interactionPolicy}
      onOpenChange={controller.handleOpenChange}
      open={controller.open}
      placement="bottom-start"
      testID={testID}
    >
      <PopoverMenuContent
        actions={actions}
        activeIndex={controller.activeIndex}
        activateAction={controller.activateAction}
        close={controller.close}
        passive={passive}
        setActiveIndex={controller.setActiveIndex}
        testID={testID}
      />
    </Popover>
  );
}

interface PopoverMenuContentProps {
  actions: readonly PopoverMenuAction[];
  activeIndex: number;
  activateAction: (action: PopoverMenuAction) => void;
  close: () => void;
  passive: boolean;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  testID?: string;
}

/*** Renders menu semantics and keyboard navigation inside an open Popover. */
function PopoverMenuContent({
  actions,
  activeIndex,
  activateAction,
  close,
  passive,
  setActiveIndex,
  testID,
}: PopoverMenuContentProps) {
  usePopoverMenuKeyboard({ actions, activeIndex, activateAction, close, passive, setActiveIndex });

  return (
    <FocusScope active onEscape={passive ? undefined : close}>
      <Surface accessibilityRole="menu" p="xs" testID={testID} variant="raised">
        {actions.map((action, index) => (
          <PopoverMenuItem
            action={action}
            active={index === activeIndex}
            activateAction={activateAction}
            key={action.id}
            passive={passive}
            testID={testID}
          />
        ))}
      </Surface>
    </FocusScope>
  );
}

/*** Subscribes an open PopoverMenu to standard menu keyboard controls. */
function usePopoverMenuKeyboard({
  actions,
  activeIndex,
  activateAction,
  close,
  passive,
  setActiveIndex,
}: Omit<PopoverMenuContentProps, 'testID'>) {
  const { bindKeydown } = useFocusManager();

  React.useEffect(
    () =>
      bindKeydown((event) => {
        if (passive) return;
        const { key } = event;
        if (key === undefined) return;
        if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
          event.preventDefault();
          setActiveIndex((current) => resolveNextMenuIndex(actions, current, key));
          return;
        }
        if (key === 'Enter') {
          event.preventDefault();
          const action = actions.at(activeIndex);
          if (action) activateAction(action);
          return;
        }
        if (key === 'Escape') {
          event.preventDefault();
          close();
        }
      }),
    [actions, activeIndex, activateAction, bindKeydown, close, passive, setActiveIndex],
  );
}

/*** Renders one accessible PopoverMenu action row. */
function PopoverMenuItem({
  action,
  active,
  activateAction,
  passive,
  testID,
}: {
  action: PopoverMenuAction;
  active: boolean;
  activateAction: (action: PopoverMenuAction) => void;
  passive: boolean;
  testID?: string;
}) {
  const { theme } = useTheme();
  const selected = action.selected ?? active;

  return (
    <Pressable
      accessibilityRole="menuitem"
      accessibilityState={{ disabled: action.disabled, selected }}
      disabled={action.disabled}
      onPress={passive ? undefined : () => activateAction(action)}
      testID={testID ? `${testID}-item-${action.id}` : undefined}
    >
      <View
        bg={selected ? theme.semantics.action.neutral.softBg : 'transparent'}
        opacity={action.disabled ? 0.56 : 1}
        px="m"
        py="s"
        radius="s"
      >
        <PopoverMenuItemContent action={action} active={active} />
      </View>
    </Pressable>
  );
}

/*** Renders the leading, textual, and trailing content of one menu action. */
function PopoverMenuItemContent({
  action,
  active,
}: {
  action: PopoverMenuAction;
  active: boolean;
}) {
  const titleColor =
    action.intent === 'danger' ? 'danger' : active || action.selected ? 'neutral' : undefined;

  return (
    <View align="center" direction="row" gap="s" justify="space-between" wrap="nowrap">
      {action.leading ? <View>{action.leading}</View> : null}
      <View flex={1}>
        <View gap="xxs">
          <Text
            color={titleColor}
            variant="bodySmall"
            weight={action.selected ? 'semiBold' : 'medium'}
          >
            {action.title}
          </Text>
          {action.description ? (
            <Text emphasis="muted" variant="caption">
              {action.description}
            </Text>
          ) : null}
        </View>
      </View>
      {action.trailing ? <View>{action.trailing}</View> : null}
    </View>
  );
}
