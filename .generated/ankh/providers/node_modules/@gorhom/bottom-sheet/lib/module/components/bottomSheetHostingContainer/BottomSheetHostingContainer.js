"use strict";

import React, { memo, useCallback, useMemo, useRef } from 'react';
import { Dimensions, StatusBar, StyleSheet, View } from 'react-native';
import { print } from '../../utilities';
import { styles } from './styles';
import { jsx as _jsx } from "react/jsx-runtime";
function BottomSheetHostingContainerComponent({
  containerLayoutState,
  layoutState,
  topInset = 0,
  bottomInset = 0,
  shouldCalculateHeight = true,
  detached,
  style,
  children
}) {
  //#region refs
  const containerRef = useRef(null);
  //#endregion

  //#region styles
  const containerStyle = useMemo(() => [style, StyleSheet.absoluteFill, styles.container, {
    top: topInset,
    bottom: bottomInset,
    overflow: detached ? 'visible' : 'hidden'
  }], [style, detached, topInset, bottomInset]);
  //#endregion

  //#region callbacks
  const handleLayoutEvent = useCallback(function handleLayoutEvent({
    nativeEvent: {
      layout: {
        height
      }
    }
  }) {
    if (containerLayoutState) {
      containerLayoutState.modify(state => {
        'worklet';

        state.height = height;
        return state;
      });
    }
    if (layoutState) {
      layoutState.modify(state => {
        'worklet';

        state.rawContainerHeight = height;
        return state;
      });
    }
    const WINDOW_HEIGHT = Dimensions.get('window').height;
    containerRef.current?.measure((_x, _y, _width, _height, _pageX, pageY) => {
      const offset = {
        bottom: Math.max(0, WINDOW_HEIGHT - ((pageY ?? 0) + height + (StatusBar.currentHeight ?? 0))),
        top: pageY ?? 0,
        left: 0,
        right: 0
      };
      if (containerLayoutState) {
        containerLayoutState.modify(state => {
          'worklet';

          state.offset = offset;
          return state;
        });
      }
      if (layoutState) {
        layoutState.modify(state => {
          'worklet';

          state.containerOffset = offset;
          return state;
        });
      }
    });
    if (__DEV__) {
      print({
        component: 'BottomSheetHostingContainer',
        method: 'handleLayoutEvent',
        category: 'layout',
        params: {
          height
        }
      });
    }
  }, [layoutState, containerLayoutState]);
  //#endregion

  //#region render
  return /*#__PURE__*/_jsx(View, {
    ref: containerRef,
    pointerEvents: "box-none",
    onLayout: shouldCalculateHeight ? handleLayoutEvent : undefined,
    style: containerStyle,
    collapsable: true,
    children: children
  });
  //#endregion
}
export const BottomSheetHostingContainer = /*#__PURE__*/memo(BottomSheetHostingContainerComponent);
BottomSheetHostingContainer.displayName = 'BottomSheetHostingContainer';
//# sourceMappingURL=BottomSheetHostingContainer.js.map