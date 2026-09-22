"use strict";

import { useCallback, useEffect } from 'react';
import { findNodeHandle } from '../utilities';
import { useBottomSheetInternal } from './useBottomSheetInternal';
export const useScrollableSetter = (ref, type, contentOffsetY, refreshable, useFocusHook = useEffect) => {
  // hooks
  const {
    animatedScrollableState,
    setScrollableRef,
    removeScrollableRef
  } = useBottomSheetInternal();

  // callbacks
  const handleSettingScrollable = useCallback(() => {
    // set current content offset
    animatedScrollableState.set(state => ({
      ...state,
      contentOffsetY: contentOffsetY.value,
      type,
      refreshable
    }));

    // set current scrollable ref
    const id = findNodeHandle(ref.current);
    if (id) {
      setScrollableRef({
        id: id,
        node: ref
      });
    } else {
      console.warn(`Couldn't find the scrollable node handle id!`);
    }
    return () => {
      removeScrollableRef(ref);
    };
  }, [ref, type, refreshable, contentOffsetY, animatedScrollableState, setScrollableRef, removeScrollableRef]);

  // effects
  useFocusHook(handleSettingScrollable);
};
//# sourceMappingURL=useScrollableSetter.js.map