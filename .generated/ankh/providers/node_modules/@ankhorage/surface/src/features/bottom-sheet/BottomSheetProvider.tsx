import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React from 'react';

import type { BottomSheetController, BottomSheetPresentOptions } from '../../types/bottomSheet';
import { BottomSheetContext } from './BottomSheetContext';

/*** Installs the shared bottom-sheet modal host and controller for descendant consumers. */
export function BottomSheetProvider({ children }: { children: React.ReactNode }) {
  const modalRef = React.useRef<BottomSheetModal>(null);
  const activeRequestRef = React.useRef<BottomSheetPresentOptions | null>(null);
  const presentedRef = React.useRef(false);
  const [activeRequest, setActiveRequest] = React.useState<BottomSheetPresentOptions | null>(null);

  const present = React.useCallback((options: BottomSheetPresentOptions) => {
    activeRequestRef.current = options;
    setActiveRequest(options);
  }, []);

  const dismiss = React.useCallback(() => {
    if (presentedRef.current) {
      modalRef.current?.dismiss();
      return;
    }

    const request = activeRequestRef.current;
    activeRequestRef.current = null;
    setActiveRequest(null);
    request?.onDismiss?.();
  }, []);

  const handleDismiss = React.useCallback(() => {
    const request = activeRequestRef.current;
    presentedRef.current = false;
    activeRequestRef.current = null;
    setActiveRequest(null);
    request?.onDismiss?.();
  }, []);

  const controller = React.useMemo<BottomSheetController>(
    () => ({ dismiss, present }),
    [dismiss, present],
  );

  return (
    <BottomSheetContext value={controller}>
      <BottomSheetModalProvider>
        {children}
        <BottomSheetHost
          activeRequest={activeRequest}
          handleDismiss={handleDismiss}
          modalRef={modalRef}
          presentedRef={presentedRef}
        />
      </BottomSheetModalProvider>
    </BottomSheetContext>
  );
}

interface BottomSheetHostProps {
  readonly activeRequest: BottomSheetPresentOptions | null;
  readonly handleDismiss: () => void;
  readonly modalRef: React.RefObject<BottomSheetModal | null>;
  readonly presentedRef: React.RefObject<boolean>;
}

/*** Renders and presents the single Gorhom modal owned by the provider. */
function BottomSheetHost({
  activeRequest,
  handleDismiss,
  modalRef,
  presentedRef,
}: BottomSheetHostProps) {
  React.useEffect(() => {
    if (!activeRequest || presentedRef.current) return;
    presentedRef.current = true;
    modalRef.current?.present();
  }, [activeRequest, modalRef, presentedRef]);

  const renderBackdrop = useBottomSheetBackdrop(activeRequest?.dismissOnBackdropPress);
  const snapPoints = React.useMemo(
    () => (activeRequest?.snapPoints ? [...activeRequest.snapPoints] : undefined),
    [activeRequest?.snapPoints],
  );

  if (!activeRequest) return null;

  return (
    <BottomSheetModal
      ref={modalRef}
      backdropComponent={renderBackdrop}
      enableDynamicSizing={activeRequest.enableDynamicSizing ?? true}
      enablePanDownToClose={activeRequest.enablePanDownToClose ?? true}
      index={activeRequest.initialIndex ?? 0}
      keyboardBehavior={activeRequest.keyboardBehavior ?? 'interactive'}
      keyboardBlurBehavior={activeRequest.keyboardBlurBehavior ?? 'restore'}
      maxDynamicContentSize={activeRequest.maxDynamicContentSize}
      onChange={activeRequest.onIndexChange}
      onDismiss={handleDismiss}
      snapPoints={snapPoints}
    >
      {renderBottomSheetContent(activeRequest)}
    </BottomSheetModal>
  );
}

/*** Renders default content in BottomSheetView and direct content without an extra wrapper. */
function renderBottomSheetContent(activeRequest: BottomSheetPresentOptions): React.ReactNode {
  return activeRequest.contentMode === 'direct' ? (
    activeRequest.content
  ) : (
    <BottomSheetView>{activeRequest.content}</BottomSheetView>
  );
}

/*** Creates the backdrop renderer for the active bottom-sheet request. */
function useBottomSheetBackdrop(dismissOnBackdropPress: boolean | undefined) {
  return React.useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={dismissOnBackdropPress === false ? 'none' : 'close'}
      />
    ),
    [dismissOnBackdropPress],
  );
}
