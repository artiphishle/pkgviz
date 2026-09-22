import React from 'react';
import { View } from 'react-native';

import { useControllableState } from '../../../../internal/useControllableState';
import type { PopoverProps } from '../../../../types/popover';
import { PopoverOverlay } from './PopoverOverlay';

/*** Renders anchored overlay content through the shared Surface overlay stack. */
export function Popover(props: PopoverProps) {
  const anchorRef = React.useRef<View | null>(null);
  const [resolvedOpen, setResolvedOpen] = useControllableState<boolean>({
    defaultValue: props.defaultOpen ?? false,
    onChange: props.onOpenChange,
    value: props.open,
  });
  const passive = props.interactionPolicy === 'passive';

  const close = React.useCallback(() => {
    if (!passive) setResolvedOpen(false);
  }, [passive, setResolvedOpen]);
  const toggle = React.useCallback(() => {
    if (!passive) setResolvedOpen(!resolvedOpen);
  }, [passive, resolvedOpen, setResolvedOpen]);

  return (
    <>
      <View
        collapsable={false}
        ref={anchorRef}
        testID={props.testID ? `${props.testID}-anchor` : undefined}
      >
        {props.anchor({ close, open: resolvedOpen, toggle })}
      </View>
      {resolvedOpen ? (
        <PopoverOverlay
          anchorRef={anchorRef}
          closeOnOutsidePress={props.closeOnOutsidePress ?? true}
          offset={props.offset ?? 8}
          onClose={close}
          passive={passive}
          placement={props.placement ?? 'bottom-start'}
          testID={props.testID}
        >
          {props.children}
        </PopoverOverlay>
      ) : null}
    </>
  );
}
