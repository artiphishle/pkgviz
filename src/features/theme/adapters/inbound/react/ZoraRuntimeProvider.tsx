'use client';

import { ZoraProvider } from '@zora/ZoraProvider';

const PKGVIZ_THEME = {
  id: 'pkgviz',
  name: 'PKGViz',
  appCategory: 'developer_tools',
  primaryColor: '#043c8c',
  harmony: 'analogous',
} as const;

/*** Installs the single ZORA theme runtime for the PKGViz application. */
export function ZoraRuntimeProvider({ children }: { readonly children: React.ReactNode }) {
  return (
    <ZoraProvider initialMode="light" theme={PKGVIZ_THEME}>
      {children}
    </ZoraProvider>
  );
}
