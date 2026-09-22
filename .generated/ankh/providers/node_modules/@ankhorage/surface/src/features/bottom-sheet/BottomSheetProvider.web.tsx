import React from 'react';
import {
  type DimensionValue,
  Modal,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import type { BottomSheetController, BottomSheetPresentOptions } from '../../types/bottomSheet';
import { Surface } from '../surface/public';
import { BottomSheetContext } from './BottomSheetContext';

/*** Installs the shared bottom-sheet controller with a React Native Web modal host. */
export function BottomSheetProvider({ children }: { children: React.ReactNode }) {
  const activeRequestRef = React.useRef<BottomSheetPresentOptions | null>(null);
  const [activeRequest, setActiveRequest] = React.useState<BottomSheetPresentOptions | null>(null);

  const dismiss = React.useCallback(() => {
    const request = activeRequestRef.current;
    if (request === null) return;

    activeRequestRef.current = null;
    setActiveRequest(null);
    request.onDismiss?.();
  }, []);

  const present = React.useCallback((options: BottomSheetPresentOptions) => {
    activeRequestRef.current = options;
    setActiveRequest(options);
  }, []);

  const controller = React.useMemo<BottomSheetController>(
    () => ({ dismiss, present }),
    [dismiss, present],
  );

  React.useEffect(() => {
    if (activeRequest === null) return;
    activeRequest.onIndexChange?.(resolveInitialIndex(activeRequest));
  }, [activeRequest]);

  return (
    <BottomSheetContext value={controller}>
      {children}
      <BottomSheetWebHost activeRequest={activeRequest} dismiss={dismiss} />
    </BottomSheetContext>
  );
}

interface BottomSheetWebHostProps {
  readonly activeRequest: BottomSheetPresentOptions | null;
  readonly dismiss: () => void;
}

/*** Presents the active request as a bottom-aligned browser modal. */
function BottomSheetWebHost({ activeRequest, dismiss }: BottomSheetWebHostProps) {
  if (activeRequest === null) return null;

  return (
    <Modal animationType="slide" onRequestClose={dismiss} transparent visible>
      <View style={styles.overlay}>
        <Pressable
          accessibilityLabel="Close bottom sheet"
          disabled={activeRequest.dismissOnBackdropPress === false}
          onPress={activeRequest.dismissOnBackdropPress === false ? undefined : dismiss}
          style={styles.backdrop}
        />
        <Surface
          radius="l"
          style={[styles.sheet, resolveSheetSize(activeRequest)]}
          variant="raised"
        >
          {renderBottomSheetContent(activeRequest)}
        </Surface>
      </View>
    </Modal>
  );
}

/*** Resolves the selected initial snap point into a portable Web height constraint. */
function resolveSheetSize(activeRequest: BottomSheetPresentOptions): ViewStyle | undefined {
  const snapPoint = activeRequest.snapPoints?.at(resolveInitialIndex(activeRequest));
  if (snapPoint === undefined) {
    return activeRequest.maxDynamicContentSize === undefined
      ? undefined
      : { maxHeight: activeRequest.maxDynamicContentSize };
  }

  return {
    height: snapPoint as DimensionValue,
    maxHeight: activeRequest.maxDynamicContentSize,
  };
}

/*** Resolves a safe initial index for callbacks and snap-point lookup. */
function resolveInitialIndex(activeRequest: BottomSheetPresentOptions): number {
  const index = activeRequest.initialIndex ?? 0;
  const lastIndex = Math.max(0, (activeRequest.snapPoints?.length ?? 1) - 1);
  return Math.min(Math.max(index, 0), lastIndex);
}

/*** Preserves direct content mode and otherwise supplies the standard sheet content wrapper. */
function renderBottomSheetContent(activeRequest: BottomSheetPresentOptions): React.ReactNode {
  return activeRequest.contentMode === 'direct' ? (
    activeRequest.content
  ) : (
    <View>{activeRequest.content}</View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '100%',
    minHeight: 1,
    overflow: 'hidden',
    width: '100%',
  },
});
