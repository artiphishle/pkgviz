import { createContext } from 'react';

import type { ThemeRuntime } from '../../../../types/theme';
import { createTheme } from '../../application/use-cases/createTheme';

const defaultTheme = createTheme();

/*** Holds the active Surface theme runtime for component consumption. */
export const ThemeRuntimeContext = createContext<ThemeRuntime>({
  theme: defaultTheme,
  mode: 'light',
  setThemeConfig: () => undefined,
  setMode: () => undefined,
});
