"use strict";

import React, { forwardRef, useContext, useImperativeHandle, useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useAnimatedProps } from 'react-native-reanimated';
import { SCROLLABLE_DECELERATION_RATE_MAPPER, SCROLLABLE_STATUS } from '../../constants';
import { BottomSheetDraggableContext } from '../../contexts/gesture';
import { useBottomSheetContentContainerStyle, useBottomSheetInternal, useScrollableSetter, useScrollHandler, useStableCallback } from '../../hooks';
import { ScrollableContainer } from './ScrollableContainer';
import { useBottomSheetContentSizeSetter } from './useBottomSheetContentSizeSetter';
import { jsx as _jsx } from "react/jsx-runtime";
export function createBottomSheetScrollableComponent(type,
// biome-ignore lint: to be addressed!
ScrollableComponent) {
  return /*#__PURE__*/forwardRef((props, ref) => {
    //#region props
    const {
      // hooks
      focusHook,
      scrollEventsHandlersHook,
      // props
      enableFooterMarginAdjustment = false,
      overScrollMode = 'never',
      keyboardDismissMode = 'interactive',
      showsVerticalScrollIndicator = true,
      contentContainerStyle: _providedContentContainerStyle,
      refreshing,
      onRefresh,
      progressViewOffset,
      refreshControl,
      // events
      onScroll,
      onScrollBeginDrag,
      onScrollEndDrag,
      onContentSizeChange,
      ...rest
      // biome-ignore lint: to be addressed!
    } = props;
    //#endregion

    //#region hooks
    const draggableGesture = useContext(BottomSheetDraggableContext);
    const {
      scrollableRef,
      scrollableContentOffsetY,
      scrollHandler
    } = useScrollHandler(scrollEventsHandlersHook, onScroll, onScrollBeginDrag, onScrollEndDrag);
    const {
      animatedScrollableStatus: animatedScrollableState,
      enableContentPanningGesture
    } = useBottomSheetInternal();
    const {
      setContentSize
    } = useBottomSheetContentSizeSetter();
    //#endregion

    if (!draggableGesture && enableContentPanningGesture) {
      throw "'Scrollable' cannot be used out of the BottomSheet!";
    }

    //#region variables
    const scrollableAnimatedProps = useAnimatedProps(() => ({
      decelerationRate: SCROLLABLE_DECELERATION_RATE_MAPPER[animatedScrollableState.value],
      showsVerticalScrollIndicator: showsVerticalScrollIndicator ? animatedScrollableState.value === SCROLLABLE_STATUS.UNLOCKED : showsVerticalScrollIndicator
    }), [animatedScrollableState, showsVerticalScrollIndicator]);
    const scrollableGesture = useMemo(() => draggableGesture ? Gesture.Native()
    // @ts-expect-error
    .simultaneousWithExternalGesture(draggableGesture).shouldCancelWhenOutside(false) : undefined, [draggableGesture]);
    //#endregion

    //#region callbacks
    const handleContentSizeChange = useStableCallback((contentWidth, contentHeight) => {
      setContentSize(contentHeight);
      if (onContentSizeChange) {
        onContentSizeChange(contentWidth, contentHeight);
      }
    });
    //#endregion

    //#region styles
    const contentContainerStyle = useBottomSheetContentContainerStyle(enableFooterMarginAdjustment, _providedContentContainerStyle);
    //#endregion

    //#region effects
    // @ts-expect-error
    useImperativeHandle(ref, () => scrollableRef.current);
    useScrollableSetter(scrollableRef, type, scrollableContentOffsetY, onRefresh !== undefined, focusHook);
    //#endregion

    //#region render
    return /*#__PURE__*/_jsx(ScrollableContainer, {
      ref: scrollableRef,
      nativeGesture: scrollableGesture,
      animatedProps: scrollableAnimatedProps,
      overScrollMode: overScrollMode,
      keyboardDismissMode: keyboardDismissMode,
      refreshing: refreshing,
      scrollEventThrottle: 16,
      progressViewOffset: progressViewOffset,
      contentContainerStyle: contentContainerStyle,
      onRefresh: onRefresh,
      onScroll: scrollHandler,
      onContentSizeChange: handleContentSizeChange,
      setContentSize: setContentSize,
      ScrollableComponent: ScrollableComponent,
      refreshControl: refreshControl,
      ...rest
    });
    //#endregion
  });
}
//# sourceMappingURL=createBottomSheetScrollableComponent.js.map