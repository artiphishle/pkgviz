import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { Portal } from '../../../../internal/overlay/Portal';
import type { PopoverPlacement } from '../../../../types/popover';
import { usePopoverLayout } from './usePopoverLayout';

/*** Renders and positions one mounted popover overlay for an open anchor. */
export function PopoverOverlay({
  anchorRef,
  children,
  closeOnOutsidePress,
  offset,
  onClose,
  passive,
  placement,
  testID,
}: PopoverOverlayProps) {
  const { onContentLayout, position, ready } = usePopoverLayout({
    anchorRef,
    offset,
    open: true,
    placement,
  });

  return (
    <Portal layer="popover" visible={ready}>
      <View pointerEvents="box-none" style={styles.overlay}>
        {closeOnOutsidePress ? (
          <Pressable
            accessibilityLabel="Close popover"
            onPress={passive ? undefined : onClose}
            style={styles.backdrop}
            testID={testID ? `${testID}-backdrop` : undefined}
          />
        ) : null}
        <View
          onLayout={onContentLayout}
          style={[styles.content, position]}
          testID={testID ? `${testID}-content` : undefined}
        >
          {children}
        </View>
      </View>
    </Portal>
  );
}

interface PopoverOverlayProps {
  anchorRef: React.RefObject<View | null>;
  children?: React.ReactNode;
  closeOnOutsidePress: boolean;
  offset: number;
  onClose: () => void;
  passive: boolean;
  placement: PopoverPlacement;
  testID?: string;
}

const absoluteFill: ViewStyle = {
  bottom: 0,
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0,
};

const styles = StyleSheet.create({
  backdrop: absoluteFill,
  content: { position: 'absolute' },
  overlay: absoluteFill,
});
