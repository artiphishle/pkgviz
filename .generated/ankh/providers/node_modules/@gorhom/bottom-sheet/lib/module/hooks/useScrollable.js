"use strict";

import { useCallback, useRef } from 'react';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { ANIMATION_STATUS, KEYBOARD_STATUS, SCROLLABLE_STATUS, SCROLLABLE_TYPE, SHEET_STATE } from '../constants';
import { findNodeHandle } from '../utilities';
export const useScrollable = (enableContentPanningGesture, animatedSheetState, animatedKeyboardState, animatedAnimationState) => {
  //#region refs
  const scrollableRef = useRef(null);
  const previousScrollableRef = useRef(null);
  //#endregion

  //#region variables
  const state = useSharedValue({
    type: SCROLLABLE_TYPE.UNDETERMINED,
    contentOffsetY: 0,
    refreshable: false
  });
  const status = useDerivedValue(() => {
    /**
     * if user had disabled content panning gesture, then we unlock
     * the scrollable state.
     */
    if (!enableContentPanningGesture) {
      return SCROLLABLE_STATUS.UNLOCKED;
    }

    /**
     * if sheet state is fill parent, then unlock scrolling
     */
    if (animatedSheetState.value === SHEET_STATE.FILL_PARENT) {
      return SCROLLABLE_STATUS.UNLOCKED;
    }

    /**
     * if sheet state is extended, then unlock scrolling
     */
    if (animatedSheetState.value === SHEET_STATE.EXTENDED) {
      return SCROLLABLE_STATUS.UNLOCKED;
    }

    /**
     * if keyboard is shown and sheet is animating
     * then we do not lock the scrolling to not lose
     * current scrollable scroll position.
     */
    if (animatedKeyboardState.get().status === KEYBOARD_STATUS.SHOWN && animatedAnimationState.get().status === ANIMATION_STATUS.RUNNING) {
      return SCROLLABLE_STATUS.UNLOCKED;
    }
    return SCROLLABLE_STATUS.LOCKED;
  }, [enableContentPanningGesture, animatedSheetState, animatedKeyboardState, animatedAnimationState, state]);
  //#endregion

  //#region callbacks
  const setScrollableRef = useCallback(ref => {
    // get current node handle id
    const currentRefId = scrollableRef.current?.id ?? null;
    if (currentRefId !== ref.id) {
      if (scrollableRef.current) {
        // @ts-expect-error
        previousScrollableRef.current = scrollableRef.current;
      }
      // @ts-expect-error
      scrollableRef.current = ref;
    }
  }, []);
  const removeScrollableRef = useCallback(ref => {
    // find node handle id
    let id;
    try {
      id = findNodeHandle(ref.current);
    } catch {
      return;
    }

    // get current node handle id
    const currentRefId = scrollableRef.current?.id ?? null;

    /**
     * @DEV
     * when the incoming node is actually the current node, we reset
     * the current scrollable ref to the previous one.
     */
    if (id === currentRefId) {
      // @ts-expect-error
      scrollableRef.current = previousScrollableRef.current;
    }
  }, []);
  //#endregion

  return {
    state,
    status,
    setScrollableRef,
    removeScrollableRef
  };
};
//# sourceMappingURL=useScrollable.js.map