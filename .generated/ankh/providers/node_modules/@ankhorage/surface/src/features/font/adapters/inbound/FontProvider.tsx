import { useMemo, useState } from 'react';

import type { FontProviderProps, FontRuntime } from '../../../../types/font';
import { FontRuntimeContext } from './FontRuntimeContext';

/*** Provide loaded-font state and the active font id to Surface theme composition. */
export function FontProvider({
  fontsLoaded,
  activeFontId: initialActiveFontId = null,
  children,
  onActiveFontChange,
}: FontProviderProps) {
  const [activeFontId, setActiveFontIdState] = useState(initialActiveFontId);
  const value = useMemo<FontRuntime>(
    () => ({
      fontsLoaded,
      activeFontId,
      setActiveFontId: (id: string) => {
        setActiveFontIdState(id);
        onActiveFontChange?.(id);
      },
    }),
    [activeFontId, fontsLoaded, onActiveFontChange],
  );

  return <FontRuntimeContext value={value}>{children}</FontRuntimeContext>;
}
