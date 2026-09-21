'use client';

import { ZoraProvider } from '@zora/ZoraProvider';

import { useThemeMode } from '@/features/theme/adapters/inbound/react/useThemeMode';

/*** Connects the application theme to the single generated ZORA runtime. */
export function ZoraRuntimeProvider({ children }: { readonly children: React.ReactNode }) {
  const { mode } = useThemeMode();

  return <ZoraProvider mode={mode}>{children}</ZoraProvider>;
}
