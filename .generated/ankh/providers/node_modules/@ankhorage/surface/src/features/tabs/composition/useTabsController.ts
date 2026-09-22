import React from 'react';

import { useControllableState } from '../../../internal/useControllableState';
import type { TabRegistration, TabsContextValue, TabsProps } from '../../../types/tabs';
import { resolveTabElementId } from '../utils/resolveTabElementId';

/*** Owns controlled state, registration, focus state, and ids for one Tabs instance. */
export function useTabsController({
  defaultValue,
  onValueChange,
  testID,
  value,
}: Pick<TabsProps, 'defaultValue' | 'onValueChange' | 'testID' | 'value'>): TabsContextValue {
  const [activeValue, setActiveValue] = useControllableState<string | undefined>({
    defaultValue,
    onChange: (nextValue) => {
      if (nextValue !== undefined) onValueChange?.(nextValue);
    },
    value,
  });
  const [focusedValue, setFocusedValue] = React.useState<string | undefined>(undefined);
  const [tabs, setTabs] = React.useState<readonly TabRegistration[]>([]);

  const registerTab = React.useCallback((tab: TabRegistration) => {
    setTabs((current) =>
      current.some((entry) => entry.value === tab.value)
        ? current.map((entry) => (entry.value === tab.value ? tab : entry))
        : [...current, tab],
    );
  }, []);
  const unregisterTab = React.useCallback((valueToRemove: string) => {
    setTabs((current) => current.filter((entry) => entry.value !== valueToRemove));
  }, []);

  React.useEffect(() => {
    if (activeValue !== undefined) return;
    const firstEnabledTab = tabs.find((entry) => !entry.disabled);
    if (firstEnabledTab) setActiveValue(firstEnabledTab.value);
  }, [activeValue, setActiveValue, tabs]);

  return React.useMemo(
    () => ({
      activeValue,
      focusedValue,
      getPanelId: (tabValue: string) => resolveTabElementId('panel', testID, tabValue),
      getTabId: (tabValue: string) => resolveTabElementId('tab', testID, tabValue),
      registerTab,
      setActiveValue: (nextValue: string) => setActiveValue(nextValue),
      setFocusedValue,
      tabs,
      unregisterTab,
    }),
    [activeValue, focusedValue, registerTab, setActiveValue, tabs, testID, unregisterTab],
  );
}
