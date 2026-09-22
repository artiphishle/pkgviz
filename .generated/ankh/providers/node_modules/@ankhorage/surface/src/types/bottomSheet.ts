import type React from 'react';

export type BottomSheetContentMode = 'view' | 'direct';

export interface BottomSheetPresentOptions {
  content: React.ReactNode;
  contentMode?: BottomSheetContentMode;
  snapPoints?: readonly (number | string)[];
  initialIndex?: number;
  enableDynamicSizing?: boolean;
  maxDynamicContentSize?: number;
  enablePanDownToClose?: boolean;
  dismissOnBackdropPress?: boolean;
  keyboardBehavior?: 'extend' | 'fillParent' | 'interactive';
  keyboardBlurBehavior?: 'none' | 'restore';
  onIndexChange?: (index: number) => void;
  onDismiss?: () => void;
}

export interface BottomSheetController {
  present: (options: BottomSheetPresentOptions) => void;
  dismiss: () => void;
}
