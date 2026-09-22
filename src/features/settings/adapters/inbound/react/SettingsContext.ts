import { createContext } from 'react';

import type { SettingsContextValue } from '@/types/settings';

/*** Owns the React context boundary for persisted PKGViz settings. */
export const SettingsContext = createContext<SettingsContextValue | null>(null);
