import React from 'react';
import { View } from 'react-native';

import { useFocusManager } from './useFocusManager';

export interface FocusScopeProps {
  active: boolean;
  children?: React.ReactNode;
  onEscape?: (() => void) | undefined;
  testID?: string;
}

export function FocusScope({ active, children, onEscape, testID }: FocusScopeProps) {
  const containerRef = React.useRef<View | null>(null);
  const { bindKeydown, capturePreviousFocus, cycleFocus, focusFirst, restorePreviousFocus } =
    useFocusManager();

  React.useEffect(() => {
    if (!active) {
      return undefined;
    }

    capturePreviousFocus();
    const timeoutId = setTimeout(() => {
      focusFirst(containerRef.current);
    }, 0);

    const unbind = bindKeydown((event) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        cycleFocus(containerRef.current, Boolean(event.shiftKey));
      }

      if (event.key === 'Escape') {
        onEscape?.();
      }
    });

    return () => {
      clearTimeout(timeoutId);
      unbind();
      restorePreviousFocus();
    };
  }, [
    active,
    bindKeydown,
    capturePreviousFocus,
    cycleFocus,
    focusFirst,
    onEscape,
    restorePreviousFocus,
  ]);

  return (
    <View
      collapsable={false}
      ref={containerRef}
      testID={testID}
      style={{
        flex: 1,
      }}
    >
      {children}
    </View>
  );
}
