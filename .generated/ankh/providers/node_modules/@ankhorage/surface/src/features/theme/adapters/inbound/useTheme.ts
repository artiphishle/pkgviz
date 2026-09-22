import { use } from 'react';

import type { ThemeRuntime } from '../../../../types/theme';
import { ThemeRuntimeContext } from './ThemeRuntimeContext';

/*** Read the active Surface theme runtime. */
export function useTheme(): ThemeRuntime {
  return use(ThemeRuntimeContext);
}
