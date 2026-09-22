"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGestureEventsHandlersDefault = void 0;
var _react = require("react");
var _reactNative = require("react-native");
var _reactNativeReanimated = require("react-native-reanimated");
var _constants = require("../constants");
var _clamp = require("../utilities/clamp");
var _snapPoint = require("../utilities/snapPoint");
var _useBottomSheetInternal = require("./useBottomSheetInternal");
const INITIAL_CONTEXT = {
  initialPosition: 0,
  initialKeyboardStatus: _constants.KEYBOARD_STATUS.UNDETERMINED,
  isScrollablePositionLocked: false
};
const dismissKeyboard = _reactNative.Keyboard.dismiss;

// biome-ignore lint: to be addressed!
const resetContext = context => {
  'worklet';

  Object.keys(context).forEach(key => {
    context[key] = undefined;
  });
};
const useGestureEventsHandlersDefault = () => {
  //#region variables
  const {
    animatedPosition,
    animatedDetentsState,
    animatedKeyboardState,
    animatedScrollableState,
    animatedLayoutState,
    enableOverDrag,
    enablePanDownToClose,
    overDragResistanceFactor,
    isInTemporaryPosition,
    enableBlurKeyboardOnGesture,
    animateToPosition,
    stopAnimation
  } = (0, _useBottomSheetInternal.useBottomSheetInternal)();
  const context = (0, _reactNativeReanimated.useSharedValue)({
    ...INITIAL_CONTEXT
  });
  //#endregion

  //#region gesture methods
  const handleOnStart = (0, _react.useCallback)(function handleOnStart(__, _) {
    'worklet';

    // cancel current animation
    stopAnimation();
    let initialKeyboardStatus = animatedKeyboardState.get().status;
    // blur the keyboard when user start dragging the bottom sheet
    if (enableBlurKeyboardOnGesture && initialKeyboardStatus === _constants.KEYBOARD_STATUS.SHOWN) {
      initialKeyboardStatus = _constants.KEYBOARD_STATUS.HIDDEN;
      (0, _reactNativeReanimated.runOnJS)(dismissKeyboard)();
    }

    // store current animated position
    context.value = {
      ...context.value,
      initialPosition: animatedPosition.value,
      initialKeyboardStatus
    };

    /**
     * if the scrollable content is scrolled, then
     * we lock the position.
     */
    if (animatedScrollableState.get().contentOffsetY > 0) {
      context.value = {
        ...context.value,
        isScrollablePositionLocked: true
      };
    }
  }, [stopAnimation, context, enableBlurKeyboardOnGesture, animatedPosition, animatedKeyboardState, animatedScrollableState]);
  const handleOnChange = (0, _react.useCallback)(function handleOnChange(source, {
    translationY
  }) {
    'worklet';

    const {
      highestDetentPosition,
      detents
    } = animatedDetentsState.get();
    if (highestDetentPosition === undefined || detents === undefined || detents.length === 0) {
      return;
    }
    let highestSnapPoint = highestDetentPosition;

    /**
     * if keyboard is shown, then we set the highest point to the current
     * position which includes the keyboard height.
     */
    if (isInTemporaryPosition.value && context.value.initialKeyboardStatus === _constants.KEYBOARD_STATUS.SHOWN) {
      highestSnapPoint = context.value.initialPosition;
    }

    /**
     * if current position is out of provided `snapPoints` and smaller then
     * highest snap pont, then we set the highest point to the current position.
     */
    if (isInTemporaryPosition.value && context.value.initialPosition < highestSnapPoint) {
      highestSnapPoint = context.value.initialPosition;
    }
    const {
      containerHeight
    } = animatedLayoutState.get();
    const lowestSnapPoint = enablePanDownToClose ? containerHeight : detents[0];

    /**
     * if scrollable is refreshable and sheet position at the highest
     * point, then do not interact with current gesture.
     */
    if (source === _constants.GESTURE_SOURCE.CONTENT && animatedScrollableState.get().refreshable && animatedPosition.value === highestSnapPoint) {
      return;
    }

    /**
     * a negative scrollable content offset to be subtracted from accumulated
     * current position and gesture translation Y to allow user to drag the sheet,
     * when scrollable position at the top.
     * a negative scrollable content offset when the scrollable is not locked.
     */
    const negativeScrollableContentOffset = context.value.initialPosition === highestSnapPoint && source === _constants.GESTURE_SOURCE.CONTENT || !context.value.isScrollablePositionLocked ? animatedScrollableState.get().contentOffsetY * -1 : 0;

    /**
     * an accumulated value of starting position with gesture translation y.
     */
    const draggedPosition = context.value.initialPosition + translationY;

    /**
     * an accumulated value of dragged position and negative scrollable content offset,
     * this will insure locking sheet position when user is scrolling the scrollable until,
     * they reach to the top of the scrollable.
     */
    const accumulatedDraggedPosition = draggedPosition + negativeScrollableContentOffset;

    /**
     * a clamped value of the accumulated dragged position, to insure keeping the dragged
     * position between the highest and lowest snap points.
     */
    const clampedPosition = (0, _clamp.clamp)(accumulatedDraggedPosition, highestSnapPoint, lowestSnapPoint);

    /**
     * if scrollable position is locked and the animated position
     * reaches the highest point, then we unlock the scrollable position.
     */
    if (context.value.isScrollablePositionLocked && source === _constants.GESTURE_SOURCE.CONTENT && animatedPosition.value === highestSnapPoint) {
      context.value = {
        ...context.value,
        isScrollablePositionLocked: false
      };
    }

    /**
     * over-drag implementation.
     */
    if (enableOverDrag) {
      if ((source === _constants.GESTURE_SOURCE.HANDLE || animatedScrollableState.get().type === _constants.SCROLLABLE_TYPE.VIEW) && draggedPosition < highestSnapPoint) {
        const resistedPosition = highestSnapPoint - Math.sqrt(1 + (highestSnapPoint - draggedPosition)) * overDragResistanceFactor;
        animatedPosition.value = resistedPosition;
        return;
      }
      if (source === _constants.GESTURE_SOURCE.HANDLE && draggedPosition > lowestSnapPoint) {
        const resistedPosition = lowestSnapPoint + Math.sqrt(1 + (draggedPosition - lowestSnapPoint)) * overDragResistanceFactor;
        animatedPosition.value = resistedPosition;
        return;
      }
      if (source === _constants.GESTURE_SOURCE.CONTENT && draggedPosition + negativeScrollableContentOffset > lowestSnapPoint) {
        const resistedPosition = lowestSnapPoint + Math.sqrt(1 + (draggedPosition + negativeScrollableContentOffset - lowestSnapPoint)) * overDragResistanceFactor;
        animatedPosition.value = resistedPosition;
        return;
      }
    }
    animatedPosition.value = clampedPosition;
  }, [enableOverDrag, enablePanDownToClose, overDragResistanceFactor, isInTemporaryPosition, animatedScrollableState, animatedDetentsState, animatedLayoutState, animatedPosition, context]);
  const handleOnEnd = (0, _react.useCallback)(function handleOnEnd(source, {
    translationY,
    absoluteY,
    velocityY
  }) {
    'worklet';

    const {
      highestDetentPosition,
      detents,
      closedDetentPosition
    } = animatedDetentsState.get();
    if (highestDetentPosition === undefined || detents === undefined || detents.length === 0 || closedDetentPosition === undefined) {
      return;
    }
    const highestSnapPoint = highestDetentPosition;
    const isSheetAtHighestSnapPoint = animatedPosition.value === highestSnapPoint;
    const {
      refreshable: scrollableIsRefreshable,
      contentOffsetY: scrollableContentOffsetY,
      type: scrollableType
    } = animatedScrollableState.get();

    /**
     * if scrollable is refreshable and sheet position at the highest
     * point, then do not interact with current gesture.
     */
    if (source === _constants.GESTURE_SOURCE.CONTENT && scrollableIsRefreshable && isSheetAtHighestSnapPoint) {
      return;
    }

    /**
     * if the sheet is in a temporary position and the gesture ended above
     * the current position, then we snap back to the temporary position.
     */
    if (isInTemporaryPosition.value && context.value.initialPosition >= animatedPosition.value) {
      if (context.value.initialPosition > animatedPosition.value) {
        animateToPosition(context.value.initialPosition, _constants.ANIMATION_SOURCE.GESTURE, velocityY / 2);
      }
      return;
    }

    /**
     * close keyboard if current position is below the recorded
     * start position and keyboard still shown.
     */
    const isScrollable = scrollableType !== _constants.SCROLLABLE_TYPE.UNDETERMINED && scrollableType !== _constants.SCROLLABLE_TYPE.VIEW;

    /**
     * if keyboard is shown and the sheet is dragged down,
     * then we dismiss the keyboard.
     */
    if (context.value.initialKeyboardStatus === _constants.KEYBOARD_STATUS.SHOWN && animatedPosition.value > context.value.initialPosition) {
      /**
       * if the platform is ios, current content is scrollable and
       * the end touch point is below the keyboard position then
       * we exit the method.
       *
       * because the the keyboard dismiss is interactive in iOS.
       */
      const {
        window
      } = animatedLayoutState.get();
      if (!(_reactNative.Platform.OS === 'ios' && isScrollable && absoluteY > window.height - animatedKeyboardState.get().heightWithinContainer)) {
        (0, _reactNativeReanimated.runOnJS)(dismissKeyboard)();
      }
    }

    /**
     * reset isInTemporaryPosition value
     */
    if (isInTemporaryPosition.value) {
      isInTemporaryPosition.value = false;
    }

    /**
     * clone snap points array, and insert the container height
     * if pan down to close is enabled.
     */
    const snapPoints = detents.slice();
    if (enablePanDownToClose) {
      snapPoints.unshift(closedDetentPosition);
    }
    const wasGestureHandledByScrollView = source === _constants.GESTURE_SOURCE.CONTENT && scrollableContentOffsetY > 0;
    let rawDestinationPosition = translationY + context.value.initialPosition;
    if (wasGestureHandledByScrollView) {
      rawDestinationPosition -= scrollableContentOffsetY;
    }

    /**
     * calculate the destination point, using redash.
     */
    const destinationPoint = (0, _snapPoint.snapPoint)(rawDestinationPosition, velocityY, snapPoints);

    /**
     * if destination point is the same as the current position,
     * then no need to perform animation.
     */
    if (destinationPoint === animatedPosition.value) {
      return;
    }

    /**
     * prevents snapping from top to middle / bottom with repeated interrupted scrolls
     */
    if (wasGestureHandledByScrollView && isSheetAtHighestSnapPoint) {
      return;
    }
    animateToPosition(destinationPoint, _constants.ANIMATION_SOURCE.GESTURE, velocityY / 2);
  }, [enablePanDownToClose, isInTemporaryPosition, animatedScrollableState, animatedLayoutState, animatedDetentsState, animatedKeyboardState, animatedPosition, animateToPosition, context]);
  const handleOnFinalize = (0, _react.useCallback)(function handleOnFinalize() {
    'worklet';

    resetContext(context);
  }, [context]);
  //#endregion

  return {
    handleOnStart,
    handleOnChange,
    handleOnEnd,
    handleOnFinalize
  };
};
exports.useGestureEventsHandlersDefault = useGestureEventsHandlersDefault;
//# sourceMappingURL=useGestureEventsHandlersDefault.js.map