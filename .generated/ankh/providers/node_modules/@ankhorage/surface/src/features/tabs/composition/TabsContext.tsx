import React from 'react';

import type { TabsContextValue } from '../../../types/tabs';

export const TabsContext = React.createContext<TabsContextValue | null>(null);
