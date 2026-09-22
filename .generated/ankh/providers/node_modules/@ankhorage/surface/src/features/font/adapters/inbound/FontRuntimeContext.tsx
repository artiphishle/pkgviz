import { createContext } from 'react';

import type { FontRuntime } from '../../../../types/font';

const fallbackRuntime: FontRuntime = {
  fontsLoaded: true,
  activeFontId: null,
  setActiveFontId: () => undefined,
};

/*** Holds Surface font runtime state for theme resolution. */
export const FontRuntimeContext = createContext<FontRuntime>(fallbackRuntime);
