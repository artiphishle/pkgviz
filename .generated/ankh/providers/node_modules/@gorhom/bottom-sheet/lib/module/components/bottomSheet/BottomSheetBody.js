"use strict";

import React, { memo, useMemo } from 'react';
import { Platform } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useBottomSheetInternal } from '../../hooks';
import { styles } from './styles';
import { jsx as _jsx } from "react/jsx-runtime";
function BottomSheetBodyComponent({
  style,
  children
}) {
  //#region hooks
  const {
    animatedIndex,
    animatedPosition
  } = useBottomSheetInternal();
  //#endregion

  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: Platform.OS === 'android' && animatedIndex.get() === -1 ? 0 : 1,
    transform: [{
      translateY: animatedPosition.get()
    }]
  }), [animatedPosition, animatedIndex]);
  const containerStyle = useMemo(() => [style, styles.container, containerAnimatedStyle], [style, containerAnimatedStyle]);
  //#endregion

  return /*#__PURE__*/_jsx(Animated.View, {
    style: containerStyle,
    collapsable: true,
    children: children
  });
}
export const BottomSheetBody = /*#__PURE__*/memo(BottomSheetBodyComponent);
BottomSheetBody.displayName = 'BottomSheetBody';
//# sourceMappingURL=BottomSheetBody.js.map