"use strict";

import React, { memo, useCallback, useMemo, useRef } from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { KEYBOARD_STATUS } from '../../constants';
import { useBottomSheetInternal, useBoundingClientRect } from '../../hooks';
import { print } from '../../utilities';
import { styles } from './styles';
import { jsx as _jsx } from "react/jsx-runtime";
function BottomSheetFooterComponent({
  animatedFooterPosition,
  bottomInset = 0,
  style,
  children
}) {
  //#region refs
  const ref = useRef(null);
  //#endregion

  //#region hooks
  const {
    animatedLayoutState,
    animatedKeyboardState
  } = useBottomSheetInternal();
  //#endregion

  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let footerTranslateY = animatedFooterPosition.get();

    /**
     * Offset the bottom inset only when keyboard is not shown
     */
    if (animatedKeyboardState.get().status !== KEYBOARD_STATUS.SHOWN) {
      footerTranslateY = footerTranslateY - bottomInset;
    }
    return {
      transform: [{
        translateY: Math.max(0, footerTranslateY)
      }]
    };
  }, [bottomInset, animatedKeyboardState, animatedFooterPosition]);
  const containerStyle = useMemo(() => [styles.container, style, containerAnimatedStyle], [style, containerAnimatedStyle]);
  //#endregion

  //#region callbacks
  const handleContainerLayout = useCallback(({
    nativeEvent: {
      layout: {
        height
      }
    }
  }) => {
    animatedLayoutState.modify(state => {
      'worklet';

      state.footerHeight = height;
      return state;
    });
    if (__DEV__) {
      print({
        component: 'BottomSheetFooter',
        method: 'handleContainerLayout',
        category: 'layout',
        params: {
          height
        }
      });
    }
  }, [animatedLayoutState]);
  const handleBoundingClientRect = useCallback(({
    height
  }) => {
    animatedLayoutState.modify(state => {
      'worklet';

      state.footerHeight = height;
      return state;
    });
    if (__DEV__) {
      print({
        component: 'BottomSheetFooter',
        method: 'handleBoundingClientRect',
        category: 'layout',
        params: {
          height
        }
      });
    }
  }, [animatedLayoutState]);
  //#endregion

  //#region effects
  useBoundingClientRect(ref, handleBoundingClientRect);
  //#endregion

  return children !== null ? /*#__PURE__*/_jsx(Animated.View, {
    ref: ref,
    onLayout: handleContainerLayout,
    style: containerStyle,
    children: children
  }) : null;
}
export const BottomSheetFooter = /*#__PURE__*/memo(BottomSheetFooterComponent);
BottomSheetFooter.displayName = 'BottomSheetFooter';
//# sourceMappingURL=BottomSheetFooter.js.map