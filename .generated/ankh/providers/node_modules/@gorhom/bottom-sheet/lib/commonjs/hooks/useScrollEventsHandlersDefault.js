"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useScrollEventsHandlersDefault = void 0;
var _react = require("react");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = require("react-native-reanimated");
var _constants = require("../constants");
var _useBottomSheetInternal = require("./useBottomSheetInternal");
const useScrollEventsHandlersDefault = (scrollableRef, scrollableContentOffsetY) => {
  // hooks
  const {
    animatedSheetState,
    animatedScrollableState,
    animatedScrollableStatus,
    animatedAnimationState,
    animatedHandleGestureState
  } = (0, _useBottomSheetInternal.useBottomSheetInternal)();

  //#region callbacks
  const handleOnScroll = (0, _react.useCallback)(({
    contentOffset: {
      y
    }
  }, context) => {
    'worklet';

    /**
     * if sheet position is extended or fill parent, then we reset
     * `shouldLockInitialPosition` value to false.
     */
    if (animatedSheetState.value === _constants.SHEET_STATE.EXTENDED || animatedSheetState.value === _constants.SHEET_STATE.FILL_PARENT) {
      context.shouldLockInitialPosition = false;
    }

    /**
     * if handle gesture state is active, then we capture the offset y position
     * and lock the scrollable with it.
     */
    if (animatedHandleGestureState.value === _reactNativeGestureHandler.State.ACTIVE) {
      context.shouldLockInitialPosition = true;
      context.initialContentOffsetY = y;
    }
    if (animatedScrollableStatus.value === _constants.SCROLLABLE_STATUS.LOCKED) {
      const lockPosition = context.shouldLockInitialPosition ? context.initialContentOffsetY ?? 0 : 0;
      // @ts-expect-error
      (0, _reactNativeReanimated.scrollTo)(scrollableRef, 0, lockPosition, false);
      scrollableContentOffsetY.value = lockPosition;
      return;
    }
  }, [scrollableRef, scrollableContentOffsetY, animatedScrollableStatus, animatedSheetState, animatedHandleGestureState]);
  const handleOnBeginDrag = (0, _react.useCallback)(({
    contentOffset: {
      y
    }
  }, context) => {
    'worklet';

    scrollableContentOffsetY.value = y;
    context.initialContentOffsetY = y;
    animatedScrollableState.set(state => ({
      ...state,
      contentOffsetY: y
    }));

    /**
     * if sheet position not extended or fill parent and the scrollable position
     * not at the top, then we should lock the initial scrollable position.
     */
    if (animatedSheetState.value !== _constants.SHEET_STATE.EXTENDED && animatedSheetState.value !== _constants.SHEET_STATE.FILL_PARENT && y > 0) {
      context.shouldLockInitialPosition = true;
    } else {
      context.shouldLockInitialPosition = false;
    }
  }, [scrollableContentOffsetY, animatedSheetState, animatedScrollableState]);
  const handleOnEndDrag = (0, _react.useCallback)(({
    contentOffset: {
      y
    }
  }, context) => {
    'worklet';

    if (animatedScrollableStatus.value === _constants.SCROLLABLE_STATUS.LOCKED) {
      const lockPosition = context.shouldLockInitialPosition ? context.initialContentOffsetY ?? 0 : 0;
      // @ts-expect-error
      (0, _reactNativeReanimated.scrollTo)(scrollableRef, 0, lockPosition, false);
      scrollableContentOffsetY.value = lockPosition;
      return;
    }
    if (animatedAnimationState.get().status !== _constants.ANIMATION_STATUS.RUNNING) {
      scrollableContentOffsetY.value = y;
      animatedScrollableState.set(state => ({
        ...state,
        contentOffsetY: y
      }));
    }
  }, [scrollableRef, scrollableContentOffsetY, animatedAnimationState, animatedScrollableStatus, animatedScrollableState]);
  const handleOnMomentumEnd = (0, _react.useCallback)(({
    contentOffset: {
      y
    }
  }, context) => {
    'worklet';

    if (animatedScrollableStatus.value === _constants.SCROLLABLE_STATUS.LOCKED) {
      const lockPosition = context.shouldLockInitialPosition ? context.initialContentOffsetY ?? 0 : 0;
      // @ts-expect-error
      (0, _reactNativeReanimated.scrollTo)(scrollableRef, 0, lockPosition, false);
      scrollableContentOffsetY.value = 0;
      return;
    }
    if (animatedAnimationState.get().status !== _constants.ANIMATION_STATUS.RUNNING) {
      scrollableContentOffsetY.value = y;
      animatedScrollableState.set(state => ({
        ...state,
        contentOffsetY: y
      }));
    }
  }, [scrollableContentOffsetY, scrollableRef, animatedAnimationState, animatedScrollableStatus, animatedScrollableState]);
  //#endregion

  return {
    handleOnScroll,
    handleOnBeginDrag,
    handleOnEndDrag,
    handleOnMomentumEnd
  };
};
exports.useScrollEventsHandlersDefault = useScrollEventsHandlersDefault;
//# sourceMappingURL=useScrollEventsHandlersDefault.js.map