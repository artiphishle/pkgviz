import React from 'react';

import type { TabsContextValue } from '../../../types/tabs';
import { TabsContext } from './TabsContext';

/*** Returns the active Tabs feature context. */
export function useTabsContext(): TabsContextValue {
  const value = React.use(TabsContext);

  if (!value) throw new Error('Tabs components must be used within <Tabs>.');

  return value;
}
