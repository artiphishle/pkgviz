import React from 'react';

import type { TabPanelProps } from '../../../../types/tabs';
import { View } from '../../../layout/public';
import { useTabsContext } from '../../composition/useTabsContext';

const TAB_PANEL_ROLE = 'tabpanel' as React.ComponentProps<typeof View>['accessibilityRole'];

/*** Renders the active content panel with the supplied View layout and tab accessibility linkage. */
export function TabPanel({ value, children, testID, ...layoutProps }: TabPanelProps) {
  const { activeValue, getPanelId, getTabId } = useTabsContext();

  if (activeValue !== value) return null;

  return (
    <View
      {...layoutProps}
      accessibilityLabelledBy={getTabId(value)}
      accessibilityRole={TAB_PANEL_ROLE}
      nativeID={getPanelId(value)}
      testID={testID}
    >
      {children}
    </View>
  );
}
