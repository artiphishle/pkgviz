import { type RefObject } from 'react';
import type { State } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import type { AnimateToPositionType, BottomSheetGestureProps, BottomSheetProps } from '../components/bottomSheet/types';
import type { SCROLLABLE_STATUS, SHEET_STATE } from '../constants';
import type { AnimationState, DetentsState, KeyboardState, LayoutState, Scrollable, ScrollableRef, ScrollableState } from '../types';
export interface BottomSheetInternalContextType extends Partial<BottomSheetGestureProps>, Required<Pick<BottomSheetProps, 'enableContentPanningGesture' | 'enableOverDrag' | 'enablePanDownToClose' | 'enableDynamicSizing' | 'enableBlurKeyboardOnGesture' | 'overDragResistanceFactor'>> {
    animatedDetentsState: SharedValue<DetentsState>;
    animatedAnimationState: SharedValue<AnimationState>;
    animatedSheetState: SharedValue<SHEET_STATE>;
    animatedKeyboardState: SharedValue<KeyboardState>;
    animatedContentGestureState: SharedValue<State>;
    animatedHandleGestureState: SharedValue<State>;
    animatedLayoutState: SharedValue<LayoutState>;
    animatedScrollableState: SharedValue<ScrollableState>;
    animatedScrollableStatus: SharedValue<SCROLLABLE_STATUS>;
    animatedPosition: SharedValue<number>;
    animatedIndex: SharedValue<number>;
    animatedSheetHeight: SharedValue<number>;
    isInTemporaryPosition: SharedValue<boolean>;
    stopAnimation: () => void;
    animateToPosition: AnimateToPositionType;
    setScrollableRef: (ref: ScrollableRef) => void;
    removeScrollableRef: (ref: RefObject<Scrollable>) => void;
    textInputNodesRef: React.MutableRefObject<Set<number>>;
}
export declare const BottomSheetInternalContext: import("react").Context<BottomSheetInternalContextType | null>;
export declare const BottomSheetInternalProvider: import("react").Provider<BottomSheetInternalContextType | null>;
//# sourceMappingURL=internal.d.ts.map