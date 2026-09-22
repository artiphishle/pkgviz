import { type RefObject } from 'react';
import { type SharedValue } from 'react-native-reanimated';
import { SCROLLABLE_STATUS, SHEET_STATE } from '../constants';
import type { AnimationState, KeyboardState, Scrollable, ScrollableRef, ScrollableState } from '../types';
export declare const useScrollable: (enableContentPanningGesture: boolean, animatedSheetState: SharedValue<SHEET_STATE>, animatedKeyboardState: SharedValue<KeyboardState>, animatedAnimationState: SharedValue<AnimationState>) => {
    state: SharedValue<ScrollableState>;
    status: import("react-native-reanimated").DerivedValue<SCROLLABLE_STATUS>;
    setScrollableRef: (ref: ScrollableRef) => void;
    removeScrollableRef: (ref: RefObject<Scrollable>) => void;
};
//# sourceMappingURL=useScrollable.d.ts.map