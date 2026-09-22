"use strict";

import React, { memo } from 'react';
import { useDerivedValue } from 'react-native-reanimated';
import { INITIAL_LAYOUT_VALUE, KEYBOARD_STATUS } from '../../constants';
import { useBottomSheetInternal } from '../../hooks';
import { jsx as _jsx } from "react/jsx-runtime";
const BottomSheetFooterContainerComponent = ({
  footerComponent: FooterComponent
}) => {
  //#region hooks
  const {
    animatedLayoutState,
    animatedPosition,
    animatedKeyboardState
  } = useBottomSheetInternal();
  //#endregion

  //#region variables
  const animatedFooterPosition = useDerivedValue(() => {
    const {
      handleHeight,
      footerHeight,
      containerHeight
    } = animatedLayoutState.get();
    if (handleHeight === INITIAL_LAYOUT_VALUE) {
      return 0;
    }
    const {
      status: keyboardStatus,
      heightWithinContainer: keyboardHeight
    } = animatedKeyboardState.get();
    const position = animatedPosition.get();
    let footerTranslateY = Math.max(0, containerHeight - position);
    if (keyboardStatus === KEYBOARD_STATUS.SHOWN) {
      footerTranslateY = footerTranslateY - keyboardHeight;
    }
    footerTranslateY = footerTranslateY - footerHeight - handleHeight;
    return footerTranslateY;
  }, [animatedKeyboardState, animatedPosition, animatedLayoutState]);
  //#endregion

  return /*#__PURE__*/_jsx(FooterComponent, {
    animatedFooterPosition: animatedFooterPosition
  });
};
export const BottomSheetFooterContainer = /*#__PURE__*/memo(BottomSheetFooterContainerComponent);
BottomSheetFooterContainer.displayName = 'BottomSheetFooterContainer';
//# sourceMappingURL=BottomSheetFooterContainer.js.map