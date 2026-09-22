import React from 'react';

import { useFocusManager } from '../../../../internal/focus/useFocusManager';
import type { TabListProps, TabNavigationKey } from '../../../../types/tabs';
import { View } from '../../../layout/public';
import { useTabsContext } from '../../composition/useTabsContext';
import { resolveNextTabValue } from '../../utils/resolveNextTabValue';

const navigationKeys: readonly string[] = [
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
];

/*** Renders the accessible tab list and owns keyboard focus navigation. */
export function TabList({ children, testID }: TabListProps) {
  const { bindKeydown } = useFocusManager();
  const { focusedValue, setActiveValue, tabs } = useTabsContext();

  React.useEffect(() => {
    if (!focusedValue) return undefined;

    return bindKeydown((event) => {
      if (!isTabNavigationKey(event.key)) return;
      const nextValue = resolveNextTabValue(tabs, focusedValue, event.key);
      if (!nextValue) return;

      event.preventDefault();
      tabs.find((tab) => tab.value === nextValue)?.focus();
      setActiveValue(nextValue);
    });
  }, [bindKeydown, focusedValue, setActiveValue, tabs]);

  return (
    <View accessibilityRole="tablist" direction="row" testID={testID}>
      {children}
    </View>
  );
}

/*** Narrows keyboard event keys to the tab navigation key contract. */
function isTabNavigationKey(key: string | undefined): key is TabNavigationKey {
  return key !== undefined && navigationKeys.includes(key);
}
