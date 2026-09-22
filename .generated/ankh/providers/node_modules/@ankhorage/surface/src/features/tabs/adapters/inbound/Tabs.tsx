import React from 'react';

import type { TabsProps } from '../../../../types/tabs';
import { View } from '../../../layout/public';
import { TabsContext } from '../../composition/TabsContext';
import { useTabsController } from '../../composition/useTabsController';

/*** Provides accessible tab selection and forwards View layout to the tab container. */
export function Tabs({
  children,
  defaultValue,
  onValueChange,
  testID,
  value,
  ...layoutProps
}: TabsProps) {
  const contextValue = useTabsController({ defaultValue, onValueChange, testID, value });

  return (
    <TabsContext value={contextValue}>
      <View {...layoutProps} testID={testID}>
        {children}
      </View>
    </TabsContext>
  );
}
