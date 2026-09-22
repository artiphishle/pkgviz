import { use } from 'react';

import { SettingsContext } from '@/features/settings/adapters/inbound/react/SettingsContext';

/*** Returns the current graph settings context. */
export function useSettings() {
  const context = use(SettingsContext);
  if (context === null) throw new Error('useSettings() must be used within a SettingsProvider');
  return context;
}
