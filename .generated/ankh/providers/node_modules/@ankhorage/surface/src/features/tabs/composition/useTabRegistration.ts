import React from 'react';
import type { Pressable } from 'react-native';

import { useTabsContext } from './useTabsContext';

/*** Registers one focusable tab with the owning Tabs context. */
export function useTabRegistration({ disabled, value }: { disabled: boolean; value: string }) {
  const { registerTab, unregisterTab } = useTabsContext();
  const pressableRef = React.useRef<React.ElementRef<typeof Pressable> | null>(null);

  React.useEffect(() => {
    registerTab({
      disabled,
      focus: () => {
        const focusable = pressableRef.current as unknown as {
          focus?: (() => void) | undefined;
        } | null;
        focusable?.focus?.();
      },
      value,
    });

    return () => unregisterTab(value);
  }, [disabled, registerTab, unregisterTab, value]);

  return pressableRef;
}
