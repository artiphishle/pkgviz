"use strict";

import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { SCROLLABLE_TYPE } from '../../constants';
import { useBottomSheetContentContainerStyle, useBottomSheetInternal } from '../../hooks';
import { print } from '../../utilities';
import { styles } from './styles';
import { jsx as _jsx } from "react/jsx-runtime";
function BottomSheetViewComponent({
  focusHook: useFocusHook = useEffect,
  enableFooterMarginAdjustment = false,
  onLayout,
  style: _providedStyle,
  children,
  ...rest
}) {
  //#region hooks
  const {
    animatedScrollableState,
    enableDynamicSizing,
    animatedLayoutState
  } = useBottomSheetInternal();
  //#endregion

  //#region styles
  const containerStyle = useBottomSheetContentContainerStyle(enableFooterMarginAdjustment, _providedStyle);
  const style = useMemo(() => [containerStyle, styles.container], [containerStyle]);
  //#endregion

  //#region callbacks
  const handleSettingScrollable = useCallback(() => {
    animatedScrollableState.set(state => ({
      ...state,
      contentOffsetY: 0,
      type: SCROLLABLE_TYPE.VIEW
    }));
  }, [animatedScrollableState]);
  const handleLayout = useCallback(event => {
    if (enableDynamicSizing) {
      const {
        nativeEvent: {
          layout: {
            height
          }
        }
      } = event;
      animatedLayoutState.modify(state => {
        'worklet';

        state.contentHeight = height;
        return state;
      });
    }
    if (onLayout) {
      onLayout(event);
    }
    if (__DEV__) {
      print({
        component: 'BottomSheetView',
        method: 'handleLayout',
        category: 'layout',
        params: {
          height: event.nativeEvent.layout.height
        }
      });
    }
  }, [onLayout, animatedLayoutState, enableDynamicSizing]);
  //#endregion

  //#region effects
  useFocusHook(handleSettingScrollable);
  //#endregion

  //render
  return /*#__PURE__*/_jsx(View, {
    ...rest,
    onLayout: handleLayout,
    style: style,
    children: children
  });
}
const BottomSheetView = /*#__PURE__*/memo(BottomSheetViewComponent);
BottomSheetView.displayName = 'BottomSheetView';
export default BottomSheetView;
//# sourceMappingURL=BottomSheetView.js.map