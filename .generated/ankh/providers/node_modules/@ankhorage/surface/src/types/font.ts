import type { ReactNode } from 'react';

export interface FontRuntime {
  fontsLoaded: boolean;
  activeFontId: string | null;
  setActiveFontId: (id: string) => void;
}

export interface FontProviderProps {
  fontsLoaded: boolean;
  activeFontId?: string | null;
  children: ReactNode;
  onActiveFontChange?: (id: string) => void;
}
