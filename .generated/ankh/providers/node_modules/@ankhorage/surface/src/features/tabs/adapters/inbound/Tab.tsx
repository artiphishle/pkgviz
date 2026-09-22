import React from 'react';
import { Pressable, type ViewStyle } from 'react-native';

import type { TabProps } from '../../../../types/tabs';
import { View } from '../../../layout/public';
import { useTheme } from '../../../theme/runtime';
import { Text } from '../../../typography/public';
import { useTabRegistration } from '../../composition/useTabRegistration';
import { useTabsContext } from '../../composition/useTabsContext';

/*** Renders one accessible selectable tab inside a Tabs context. */
export function Tab({
  value,
  children,
  disabled = false,
  interactionPolicy = 'enabled',
  testID,
}: TabProps) {
  const { theme } = useTheme();
  const { activeValue, getPanelId, getTabId, setActiveValue, setFocusedValue } = useTabsContext();
  const pressableRef = useTabRegistration({ disabled, value });
  const selected = activeValue === value;
  const passive = interactionPolicy === 'passive';
  const onPress = passive || disabled ? undefined : () => setActiveValue(value);

  return (
    <Pressable
      accessibilityLabel={undefined}
      accessibilityRole="tab"
      accessibilityState={{ disabled, selected }}
      aria-controls={getPanelId(value)}
      disabled={disabled}
      nativeID={getTabId(value)}
      onBlur={() => setFocusedValue(undefined)}
      onFocus={() => setFocusedValue(value)}
      onPress={onPress}
      ref={pressableRef}
      testID={testID}
    >
      <View
        px="m"
        py="s"
        style={resolveTabStyle({
          borderColor: selected
            ? theme.semantics.action.primary.base
            : theme.semantics.border.default,
          disabled,
        })}
      >
        <Text color={selected ? 'primary' : undefined} variant="label" weight="medium">
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

/*** Resolves active and disabled visual state without inline JSX styles. */
function resolveTabStyle({
  borderColor,
  disabled,
}: {
  borderColor: string;
  disabled: boolean;
}): ViewStyle {
  return { borderBottomColor: borderColor, borderBottomWidth: 2, opacity: disabled ? 0.64 : 1 };
}
