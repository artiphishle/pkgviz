"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _invariant = _interopRequireDefault(require("invariant"));
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _constants = require("../../constants");
var _contexts = require("../../contexts");
var _hooks = require("../../hooks");
var _utilities = require("../../utilities");
var _bottomSheetBackground = require("../bottomSheetBackground");
var _bottomSheetFooter = require("../bottomSheetFooter");
var _bottomSheetGestureHandlersProvider = _interopRequireDefault(require("../bottomSheetGestureHandlersProvider"));
var _bottomSheetHandle = require("../bottomSheetHandle");
var _bottomSheetHostingContainer = require("../bottomSheetHostingContainer");
var _BottomSheetBody = require("./BottomSheetBody");
var _BottomSheetContent = require("./BottomSheetContent");
var _constants2 = require("./constants");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// import BottomSheetDebugView from '../bottomSheetDebugView';

_reactNativeReanimated.default.addWhitelistedUIProps({
  decelerationRate: true
});
const BottomSheetComponent = /*#__PURE__*/(0, _react.forwardRef)(function BottomSheet(props, ref) {
  //#region extract props
  const {
    // animations configurations
    animationConfigs: _providedAnimationConfigs,
    // configurations
    index: _providedIndex = 0,
    snapPoints: _providedSnapPoints,
    animateOnMount = _constants2.DEFAULT_ANIMATE_ON_MOUNT,
    enableContentPanningGesture = _constants2.DEFAULT_ENABLE_CONTENT_PANNING_GESTURE,
    enableHandlePanningGesture,
    enableOverDrag = _constants2.DEFAULT_ENABLE_OVER_DRAG,
    enablePanDownToClose = _constants2.DEFAULT_ENABLE_PAN_DOWN_TO_CLOSE,
    enableDynamicSizing = _constants2.DEFAULT_DYNAMIC_SIZING,
    overDragResistanceFactor = _constants2.DEFAULT_OVER_DRAG_RESISTANCE_FACTOR,
    overrideReduceMotion: _providedOverrideReduceMotion,
    // styles
    style,
    containerStyle: _providedContainerStyle,
    backgroundStyle: _providedBackgroundStyle,
    handleStyle: _providedHandleStyle,
    handleIndicatorStyle: _providedHandleIndicatorStyle,
    // hooks
    gestureEventsHandlersHook,
    // keyboard
    keyboardBehavior = _constants2.DEFAULT_KEYBOARD_BEHAVIOR,
    keyboardBlurBehavior = _constants2.DEFAULT_KEYBOARD_BLUR_BEHAVIOR,
    android_keyboardInputMode = _constants2.DEFAULT_KEYBOARD_INPUT_MODE,
    enableBlurKeyboardOnGesture = _constants2.DEFAULT_ENABLE_BLUR_KEYBOARD_ON_GESTURE,
    // layout
    containerLayoutState,
    topInset = 0,
    bottomInset = 0,
    maxDynamicContentSize,
    containerHeight,
    containerOffset,
    // animated callback shared values
    animatedPosition: _providedAnimatedPosition,
    animatedIndex: _providedAnimatedIndex,
    // gestures
    simultaneousHandlers: _providedSimultaneousHandlers,
    waitFor: _providedWaitFor,
    activeOffsetX: _providedActiveOffsetX,
    activeOffsetY: _providedActiveOffsetY,
    failOffsetX: _providedFailOffsetX,
    failOffsetY: _providedFailOffsetY,
    // callbacks
    onChange: _providedOnChange,
    onClose: _providedOnClose,
    onAnimate: _providedOnAnimate,
    // private
    $modal = false,
    detached = false,
    // components
    handleComponent = _bottomSheetHandle.BottomSheetHandle,
    backdropComponent: BackdropComponent,
    backgroundComponent,
    footerComponent,
    children,
    // accessibility
    accessible: _providedAccessible = _constants2.DEFAULT_ACCESSIBLE,
    accessibilityLabel: _providedAccessibilityLabel = _constants2.DEFAULT_ACCESSIBILITY_LABEL,
    accessibilityRole: _providedAccessibilityRole = _constants2.DEFAULT_ACCESSIBILITY_ROLE
  } = props;
  //#endregion

  //#region validate props
  if (__DEV__) {
    // biome-ignore lint/correctness/useHookAtTopLevel: used in development only.
    (0, _hooks.usePropsValidator)({
      index: _providedIndex,
      snapPoints: _providedSnapPoints,
      enableDynamicSizing,
      topInset,
      bottomInset,
      containerHeight,
      containerOffset
    });
  }
  //#endregion

  //#region layout variables
  const animatedLayoutState = (0, _hooks.useAnimatedLayout)(containerLayoutState, topInset, bottomInset, $modal, handleComponent === null);
  const animatedDetentsState = (0, _hooks.useAnimatedDetents)(_providedSnapPoints, animatedLayoutState, enableDynamicSizing, maxDynamicContentSize, detached, $modal, bottomInset);
  const animatedSheetHeight = (0, _reactNativeReanimated.useDerivedValue)(() => {
    const {
      containerHeight
    } = animatedLayoutState.get();
    const {
      highestDetentPosition
    } = animatedDetentsState.get();
    if (highestDetentPosition === undefined) {
      return _constants.INITIAL_LAYOUT_VALUE;
    }
    return containerHeight - highestDetentPosition;
  }, [animatedLayoutState, animatedDetentsState]);
  const animatedCurrentIndex = (0, _hooks.useReactiveSharedValue)(animateOnMount ? -1 : _providedIndex);
  const animatedPosition = (0, _reactNativeReanimated.useSharedValue)(_reactNative.Dimensions.get('window').height);

  // conditional
  const didAnimateOnMount = (0, _reactNativeReanimated.useSharedValue)(!animateOnMount || _providedIndex === -1);
  const isLayoutCalculated = (0, _reactNativeReanimated.useDerivedValue)(() => {
    let isContainerHeightCalculated = false;
    const {
      containerHeight,
      handleHeight
    } = animatedLayoutState.get();
    //container height was provided and set not to initial value
    if (containerHeight !== null && containerHeight !== undefined && containerHeight !== _constants.INITIAL_LAYOUT_VALUE) {
      isContainerHeightCalculated = true;
    }
    let isHandleHeightCalculated = false;
    // handle component is null.
    if (handleComponent === null) {
      isHandleHeightCalculated = true;
    }
    // handle height did set.
    if (handleHeight !== _constants.INITIAL_LAYOUT_VALUE) {
      isHandleHeightCalculated = true;
    }
    let isSnapPointsNormalized = false;
    const {
      detents
    } = animatedDetentsState.get();
    // the first snap point did normalized
    if (detents) {
      isSnapPointsNormalized = true;
    }
    return isContainerHeightCalculated && isHandleHeightCalculated && isSnapPointsNormalized;
  }, [animatedLayoutState, animatedDetentsState, handleComponent]);
  const isInTemporaryPosition = (0, _reactNativeReanimated.useSharedValue)(false);
  const animatedContainerHeightDidChange = (0, _reactNativeReanimated.useSharedValue)(false);

  // gesture
  const animatedContentGestureState = (0, _reactNativeReanimated.useSharedValue)(_reactNativeGestureHandler.State.UNDETERMINED);
  const animatedHandleGestureState = (0, _reactNativeReanimated.useSharedValue)(_reactNativeGestureHandler.State.UNDETERMINED);
  //#endregion

  //#region hooks variables
  // keyboard
  const {
    state: animatedKeyboardState,
    textInputNodesRef
  } = (0, _hooks.useAnimatedKeyboard)();
  const userReduceMotionSetting = (0, _reactNativeReanimated.useReducedMotion)();
  const reduceMotion = (0, _react.useMemo)(() => {
    return !_providedOverrideReduceMotion || _providedOverrideReduceMotion === _reactNativeReanimated.ReduceMotion.System ? userReduceMotionSetting : _providedOverrideReduceMotion === _reactNativeReanimated.ReduceMotion.Always;
  }, [userReduceMotionSetting, _providedOverrideReduceMotion]);
  //#endregion

  //#region state/dynamic variables
  // states
  const animatedAnimationState = (0, _reactNativeReanimated.useSharedValue)({
    status: _constants.ANIMATION_STATUS.UNDETERMINED,
    source: _constants.ANIMATION_SOURCE.MOUNT
  });
  const animatedSheetState = (0, _reactNativeReanimated.useDerivedValue)(() => {
    const {
      detents,
      closedDetentPosition
    } = animatedDetentsState.get();
    if (!detents || detents.length === 0 || closedDetentPosition === undefined) {
      return _constants.SHEET_STATE.CLOSED;
    }

    // closed position = position >= container height
    if (animatedPosition.value >= closedDetentPosition) {
      return _constants.SHEET_STATE.CLOSED;
    }
    const {
      containerHeight
    } = animatedLayoutState.get();
    // extended position = container height - sheet height
    const extendedPosition = containerHeight - animatedSheetHeight.value;
    if (animatedPosition.value === extendedPosition) {
      return _constants.SHEET_STATE.EXTENDED;
    }

    // extended position with keyboard =
    // container height - (sheet height + keyboard height in root container)
    const keyboardHeightInContainer = animatedKeyboardState.get().heightWithinContainer;
    const extendedPositionWithKeyboard = Math.max(0, containerHeight - (animatedSheetHeight.value + keyboardHeightInContainer));

    // detect if keyboard is open and the sheet is in temporary position
    if (keyboardBehavior === _constants.KEYBOARD_BEHAVIOR.interactive && isInTemporaryPosition.value && animatedPosition.value === extendedPositionWithKeyboard) {
      return _constants.SHEET_STATE.EXTENDED;
    }

    // fill parent = 0
    if (animatedPosition.value === 0) {
      return _constants.SHEET_STATE.FILL_PARENT;
    }

    // detect if position is below extended point
    if (animatedPosition.value < extendedPosition) {
      return _constants.SHEET_STATE.OVER_EXTENDED;
    }
    return _constants.SHEET_STATE.OPENED;
  }, [animatedLayoutState, animatedDetentsState, animatedKeyboardState, animatedPosition, animatedSheetHeight, isInTemporaryPosition, keyboardBehavior]);
  const {
    state: animatedScrollableState,
    status: animatedScrollableStatus,
    setScrollableRef,
    removeScrollableRef
  } = (0, _hooks.useScrollable)(enableContentPanningGesture, animatedSheetState, animatedKeyboardState, animatedAnimationState);
  // dynamic
  const animatedIndex = (0, _reactNativeReanimated.useDerivedValue)(() => {
    const {
      detents
    } = animatedDetentsState.get();
    if (!detents || detents.length === 0) {
      return -1;
    }
    const adjustedSnapPoints = detents.slice().reverse();
    const adjustedSnapPointsIndexes = detents.slice().map((_, index) => index).reverse();
    const {
      containerHeight
    } = animatedLayoutState.get();
    /**
     * we add the close state index `-1`
     */
    adjustedSnapPoints.push(containerHeight);
    adjustedSnapPointsIndexes.push(-1);
    const currentIndex = isLayoutCalculated.value ? (0, _reactNativeReanimated.interpolate)(animatedPosition.value, adjustedSnapPoints, adjustedSnapPointsIndexes, _reactNativeReanimated.Extrapolation.CLAMP) : -1;
    const {
      status: animationStatus,
      source: animationSource,
      nextIndex,
      nextPosition
    } = animatedAnimationState.get();
    /**
     * if the sheet is currently running an animation by the keyboard opening,
     * then we clamp the index on android with resize keyboard mode.
     */
    if (android_keyboardInputMode === _constants.KEYBOARD_INPUT_MODE.adjustResize && animationStatus === _constants.ANIMATION_STATUS.RUNNING && animationSource === _constants.ANIMATION_SOURCE.KEYBOARD && isInTemporaryPosition.value) {
      return Math.max(animatedCurrentIndex.value, currentIndex);
    }

    /**
     * if the sheet is currently running an animation by snap point change - usually caused
     * by dynamic content height -, then we return the next position index.
     */
    if (animationStatus === _constants.ANIMATION_STATUS.RUNNING && animationSource === _constants.ANIMATION_SOURCE.SNAP_POINT_CHANGE && nextIndex !== undefined && nextPosition !== undefined) {
      return nextIndex;
    }
    return currentIndex;
  }, [android_keyboardInputMode, animatedAnimationState, animatedLayoutState, animatedCurrentIndex, animatedPosition, animatedDetentsState, isInTemporaryPosition, isLayoutCalculated]);
  //#endregion

  //#region private methods
  const handleOnChange = (0, _react.useCallback)(function handleOnChange(index, position) {
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheet',
        method: 'handleOnChange',
        category: 'callback',
        params: {
          index,
          position
        }
      });
    }
    if (!_providedOnChange) {
      return;
    }
    const {
      dynamicDetentIndex
    } = animatedDetentsState.get();
    _providedOnChange(index, position, index === dynamicDetentIndex ? _constants.SNAP_POINT_TYPE.DYNAMIC : _constants.SNAP_POINT_TYPE.PROVIDED);
  }, [_providedOnChange, animatedDetentsState]);
  const handleOnAnimate = (0, _react.useCallback)(function handleOnAnimate(targetIndex, targetPosition) {
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheet',
        method: 'handleOnAnimate',
        category: 'callback',
        params: {
          toIndex: targetIndex,
          toPosition: targetPosition,
          fromIndex: animatedCurrentIndex.value,
          fromPosition: animatedPosition.value
        }
      });
    }
    if (targetIndex === animatedCurrentIndex.get()) {
      return;
    }
    if (!_providedOnAnimate) {
      return;
    }
    _providedOnAnimate(animatedCurrentIndex.value, targetIndex, animatedPosition.value, targetPosition);
  }, [_providedOnAnimate, animatedCurrentIndex, animatedPosition]);
  const handleOnClose = (0, _react.useCallback)(function handleOnClose() {
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheet',
        method: 'handleOnClose',
        category: 'callback'
      });
    }
    if (!_providedOnClose) {
      return;
    }
    _providedOnClose();
  }, [_providedOnClose]);
  //#endregion

  //#region animation
  const stopAnimation = (0, _react.useCallback)(() => {
    'worklet';

    (0, _reactNativeReanimated.cancelAnimation)(animatedPosition);
    animatedAnimationState.set({
      status: _constants.ANIMATION_STATUS.STOPPED,
      source: _constants.ANIMATION_SOURCE.NONE
    });
  }, [animatedPosition, animatedAnimationState]);
  const animateToPositionCompleted = (0, _react.useCallback)(function animateToPositionCompleted(isFinished) {
    'worklet';

    if (!isFinished) {
      return;
    }
    const {
      nextIndex,
      nextPosition
    } = animatedAnimationState.get();
    if (__DEV__) {
      (0, _reactNativeReanimated.runOnJS)(_utilities.print)({
        component: 'BottomSheet',
        method: 'animateToPositionCompleted',
        params: {
          currentIndex: animatedCurrentIndex.value,
          nextIndex,
          nextPosition
        }
      });
    }
    if (nextIndex === undefined || nextPosition === undefined) {
      return;
    }

    // callbacks
    if (nextIndex !== animatedCurrentIndex.get()) {
      (0, _reactNativeReanimated.runOnJS)(handleOnChange)(nextIndex, nextPosition);
    }
    if (nextIndex === -1) {
      (0, _reactNativeReanimated.runOnJS)(handleOnClose)();
    }
    animatedCurrentIndex.set(nextIndex);

    // reset values
    animatedContainerHeightDidChange.set(false);
    didAnimateOnMount.set(true);
    animatedAnimationState.set({
      status: _constants.ANIMATION_STATUS.STOPPED,
      source: _constants.ANIMATION_SOURCE.NONE,
      nextIndex: undefined,
      nextPosition: undefined,
      isForcedClosing: undefined
    });
  }, [handleOnChange, handleOnClose, animatedCurrentIndex, animatedAnimationState, animatedContainerHeightDidChange, didAnimateOnMount]);
  const animateToPosition = (0, _react.useCallback)(function animateToPosition(position, source, velocity = 0, configs) {
    'worklet';

    if (__DEV__) {
      (0, _reactNativeReanimated.runOnJS)(_utilities.print)({
        component: 'BottomSheet',
        method: 'animateToPosition',
        params: {
          currentPosition: animatedPosition.value,
          nextPosition: position,
          source
        }
      });
    }
    if (position === undefined) {
      return;
    }
    if (position === animatedPosition.get()) {
      return;
    }

    // early exit if there is a running animation to
    // the same position
    const {
      status: animationStatus,
      nextPosition
    } = animatedAnimationState.get();
    if (animationStatus === _constants.ANIMATION_STATUS.RUNNING && position === nextPosition) {
      return;
    }

    // stop animation if it is running
    if (animationStatus === _constants.ANIMATION_STATUS.RUNNING) {
      stopAnimation();
    }

    /**
     * offset the position if keyboard is shown and behavior not extend.
     */
    let offset = 0;
    const {
      status,
      heightWithinContainer
    } = animatedKeyboardState.get();
    const sheetState = animatedSheetState.get();
    if (status === _constants.KEYBOARD_STATUS.SHOWN && keyboardBehavior !== _constants.KEYBOARD_BEHAVIOR.extend && ([_constants.ANIMATION_SOURCE.KEYBOARD, _constants.ANIMATION_SOURCE.SNAP_POINT_CHANGE].includes(source) || sheetState === _constants.SHEET_STATE.OVER_EXTENDED)) {
      offset = heightWithinContainer;
    }
    const {
      detents,
      closedDetentPosition,
      highestDetentPosition
    } = animatedDetentsState.get();
    let index = detents?.indexOf(position + offset) ?? -1;

    /**
     * because keyboard position is not part of the detents array,
     * we will need to manually set the index to the highest detent index.
     */
    if (index === -1 && status === _constants.KEYBOARD_STATUS.SHOWN && position !== closedDetentPosition) {
      if (detents !== undefined && highestDetentPosition !== undefined) {
        index = detents.indexOf(highestDetentPosition);
      }
      if (index === -1) {
        index = _constants2.DEFAULT_KEYBOARD_INDEX;
      }
    }

    /**
     * set the animation state
     */
    animatedAnimationState.set(state => {
      'worklet';

      return {
        ...state,
        status: _constants.ANIMATION_STATUS.RUNNING,
        source,
        nextIndex: index,
        nextPosition: position
      };
    });

    /**
     * fire `onAnimate` callback
     */
    (0, _reactNativeReanimated.runOnJS)(handleOnAnimate)(index, position);

    /**
     * start animation
     */
    animatedPosition.value = (0, _utilities.animate)({
      point: position,
      configs: configs || _providedAnimationConfigs,
      velocity,
      overrideReduceMotion: _providedOverrideReduceMotion,
      onComplete: animateToPositionCompleted
    });
  }, [handleOnAnimate, stopAnimation, animateToPositionCompleted, keyboardBehavior, _providedAnimationConfigs, _providedOverrideReduceMotion, animatedDetentsState, animatedAnimationState, animatedKeyboardState, animatedPosition, animatedSheetState]);
  /**
   * Set to position without animation.
   *
   * @param targetPosition position to be set.
   */
  const setToPosition = (0, _react.useCallback)(function setToPosition(targetPosition) {
    'worklet';

    if (!targetPosition) {
      return;
    }
    if (targetPosition === animatedPosition.get()) {
      return;
    }
    const {
      status: animationStatus,
      nextPosition
    } = animatedAnimationState.get();

    // early exit if there is a running animation to
    // the same position
    if (animationStatus === _constants.ANIMATION_STATUS.RUNNING && targetPosition === nextPosition) {
      return;
    }
    if (__DEV__) {
      (0, _reactNativeReanimated.runOnJS)(_utilities.print)({
        component: 'BottomSheet',
        method: 'setToPosition',
        params: {
          currentPosition: animatedPosition.value,
          targetPosition
        }
      });
    }

    /**
     * store next position
     */
    const {
      detents
    } = animatedDetentsState.get();
    const index = detents?.indexOf(targetPosition) ?? -1;
    animatedAnimationState.set(state => {
      'worklet';

      return {
        ...state,
        nextPosition: targetPosition,
        nextIndex: index
      };
    });
    stopAnimation();

    // set values
    animatedPosition.value = targetPosition;
    animatedContainerHeightDidChange.value = false;
  }, [stopAnimation, animatedPosition, animatedContainerHeightDidChange, animatedAnimationState, animatedDetentsState]);
  //#endregion

  //#region private methods
  /**
   * Calculate and evaluate the current position based on multiple
   * local states.
   */
  const getEvaluatedPosition = (0, _react.useCallback)(function getEvaluatedPosition(source) {
    'worklet';

    const currentIndex = animatedCurrentIndex.value;
    const {
      detents,
      highestDetentPosition,
      closedDetentPosition
    } = animatedDetentsState.get();
    const keyboardStatus = animatedKeyboardState.get().status;
    if (detents === undefined || highestDetentPosition === undefined || closedDetentPosition === undefined) {
      return;
    }

    /**
     * if the keyboard blur behavior is restore and keyboard is hidden,
     * then we return the previous snap point.
     */
    if (source === _constants.ANIMATION_SOURCE.KEYBOARD && keyboardBlurBehavior === _constants.KEYBOARD_BLUR_BEHAVIOR.restore && keyboardStatus === _constants.KEYBOARD_STATUS.HIDDEN && animatedContentGestureState.value !== _reactNativeGestureHandler.State.ACTIVE && animatedHandleGestureState.value !== _reactNativeGestureHandler.State.ACTIVE) {
      isInTemporaryPosition.value = false;
      const nextPosition = detents[currentIndex];
      return nextPosition;
    }

    /**
     * if the keyboard appearance behavior is extend and keyboard is shown,
     * then we return the heights snap point.
     */
    if (keyboardBehavior === _constants.KEYBOARD_BEHAVIOR.extend && keyboardStatus === _constants.KEYBOARD_STATUS.SHOWN) {
      return highestDetentPosition;
    }

    /**
     * if the keyboard appearance behavior is fill parent and keyboard is shown,
     * then we return 0 ( full screen ).
     */
    if (keyboardBehavior === _constants.KEYBOARD_BEHAVIOR.fillParent && keyboardStatus === _constants.KEYBOARD_STATUS.SHOWN) {
      isInTemporaryPosition.value = true;
      return 0;
    }

    /**
     * if the keyboard appearance behavior is interactive and keyboard is shown,
     * then we return the heights points minus the keyboard in container height.
     */
    if (keyboardBehavior === _constants.KEYBOARD_BEHAVIOR.interactive && keyboardStatus === _constants.KEYBOARD_STATUS.SHOWN &&
    // ensure that this logic does not run on android
    // with resize input mode
    !(_reactNative.Platform.OS === 'android' && android_keyboardInputMode === 'adjustResize')) {
      isInTemporaryPosition.value = true;
      const keyboardHeightInContainer = animatedKeyboardState.get().heightWithinContainer;
      return Math.max(0, highestDetentPosition - keyboardHeightInContainer);
    }

    /**
     * if the bottom sheet is in temporary position, then we return
     * the current position.
     */
    if (isInTemporaryPosition.value) {
      return animatedPosition.value;
    }

    /**
     * if the bottom sheet did not animate on mount,
     * then we return the provided index or the closed position.
     */
    if (!didAnimateOnMount.value) {
      return _providedIndex === -1 ? closedDetentPosition : detents[_providedIndex];
    }
    const {
      status,
      nextIndex,
      nextPosition
    } = animatedAnimationState.get();

    /**
     * if the evaluated position is for a snap change source while the sheet is currently running
     * an animation and the next position is different than the detent at next index,
     * then we return the detent at next index.
     *
     * https://github.com/gorhom/react-native-bottom-sheet/issues/2431
     */
    if (source === _constants.ANIMATION_SOURCE.SNAP_POINT_CHANGE && status === _constants.ANIMATION_STATUS.RUNNING && nextIndex !== undefined && nextPosition !== undefined && detents[nextIndex] !== nextPosition) {
      return detents[nextIndex];
    }

    /**
     * return the current index position.
     */
    return detents[currentIndex];
  }, [animatedContentGestureState, animatedCurrentIndex, animatedHandleGestureState, animatedAnimationState, animatedKeyboardState, animatedPosition, animatedDetentsState, isInTemporaryPosition, didAnimateOnMount, keyboardBehavior, keyboardBlurBehavior, _providedIndex, android_keyboardInputMode]);

  /**
   * Evaluate the bottom sheet position based based on a event source and other local states.
   */
  const evaluatePosition = (0, _react.useCallback)(function evaluatePosition(source, animationConfigs) {
    'worklet';

    const {
      status: animationStatus,
      nextIndex,
      isForcedClosing
    } = animatedAnimationState.get();
    const {
      detents,
      closedDetentPosition
    } = animatedDetentsState.get();
    if (detents === undefined || detents.length === 0 || closedDetentPosition === undefined) {
      return;
    }

    /**
     * if a force closing is running and source not from user, then we early exit
     */
    if (isForcedClosing && source !== _constants.ANIMATION_SOURCE.USER) {
      return;
    }
    /**
     * when evaluating the position while layout is not calculated, then we early exit till it is.
     */
    if (!isLayoutCalculated.value) {
      return;
    }
    const proposedPosition = getEvaluatedPosition(source);
    if (proposedPosition === undefined) {
      return;
    }

    /**
     * when evaluating the position while the mount animation not been handled,
     * then we evaluate on mount use cases.
     */
    if (!didAnimateOnMount.value) {
      /**
       * If a *close* animation is already running, do not override it with the mount
       * animation (#2655). Keyboard-driven animations can also be RUNNING during this
       * phase (e.g. TextInput autoFocus); those must not block mount or the sheet stays
       * misaligned with the keyboard (#2661).
       */
      if (animationStatus === _constants.ANIMATION_STATUS.RUNNING && (isForcedClosing || nextIndex === -1)) {
        return;
      }
      /**
       * if animate on mount is set to true, then we animate to the propose position,
       * else, we set the position with out animation.
       */
      if (animateOnMount) {
        animateToPosition(proposedPosition, _constants.ANIMATION_SOURCE.MOUNT, undefined, animationConfigs);
      } else {
        setToPosition(proposedPosition);
        didAnimateOnMount.value = true;
      }
      return;
    }

    /**
     * when evaluating the position while the bottom sheet is animating.
     */
    if (animationStatus === _constants.ANIMATION_STATUS.RUNNING) {
      const nextPositionIndex = nextIndex ?? _constants2.INITIAL_VALUE;
      /**
       * when evaluating the position while the bottom sheet is
       * closing, then we force closing the bottom sheet with no animation.
       */
      if (nextPositionIndex === -1 && !isInTemporaryPosition.value) {
        setToPosition(closedDetentPosition);
        return;
      }

      /**
       * when evaluating the position while it's animating to
       * a position other than the current position, then we
       * restart the animation.
       */
      if (nextPositionIndex !== animatedCurrentIndex.value) {
        animateToPosition(detents[nextPositionIndex], source, undefined, animationConfigs);
        return;
      }
    }

    /**
     * when evaluating the position while the bottom sheet is in closed
     * position and not animating, we re-set the position to closed position.
     */
    if (animationStatus !== _constants.ANIMATION_STATUS.RUNNING && animatedCurrentIndex.value === -1) {
      /**
       * early exit if reduce motion is enabled and index is out of sync with position.
       */
      if (reduceMotion && detents[animatedIndex.value] !== animatedPosition.value) {
        return;
      }
      setToPosition(closedDetentPosition);
      return;
    }

    /**
     * when evaluating the position after the container resize, then we
     * force the bottom sheet to the proposed position with no
     * animation.
     */
    if (animatedContainerHeightDidChange.value) {
      setToPosition(proposedPosition);
      return;
    }

    /**
     * we fall back to the proposed position.
     */
    animateToPosition(proposedPosition, source, undefined, animationConfigs);
  }, [getEvaluatedPosition, animateToPosition, setToPosition, reduceMotion, animateOnMount, animatedAnimationState, animatedContainerHeightDidChange, animatedCurrentIndex, animatedIndex, animatedPosition, animatedDetentsState, didAnimateOnMount, isInTemporaryPosition, isLayoutCalculated]);
  //#endregion

  //#region public methods
  const handleSnapToIndex = (0, _hooks.useStableCallback)(function handleSnapToIndex(index, animationConfigs) {
    const {
      detents
    } = animatedDetentsState.get();
    const isLayoutReady = isLayoutCalculated.get();
    if (detents === undefined || detents.length === 0) {
      return;
    }

    // early exit if layout is not ready yet.
    if (!isLayoutReady) {
      return;
    }
    (0, _invariant.default)(index >= -1 && index <= detents.length - 1, `'index' was provided but out of the provided snap points range! expected value to be between -1, ${detents.length - 1}`);
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheet',
        method: 'handleSnapToIndex',
        params: {
          index
        }
      });
    }
    const targetPosition = detents[index];

    /**
     * exit method if :
     * - layout is not calculated.
     * - already animating to next position.
     * - sheet is forced closing.
     */
    const {
      nextPosition,
      nextIndex,
      isForcedClosing
    } = animatedAnimationState.get();
    if (!isLayoutCalculated.value || index === nextIndex || targetPosition === nextPosition || isForcedClosing) {
      return;
    }

    /**
     * reset temporary position boolean.
     */
    isInTemporaryPosition.value = false;
    (0, _reactNativeReanimated.runOnUI)(animateToPosition)(targetPosition, _constants.ANIMATION_SOURCE.USER, 0, animationConfigs);
  });
  const handleSnapToPosition = (0, _react.useCallback)(function handleSnapToPosition(position, animationConfigs) {
    'worklet';

    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheet',
        method: 'handleSnapToPosition',
        params: {
          position
        }
      });
    }
    const {
      containerHeight
    } = animatedLayoutState.get();
    /**
     * normalized provided position.
     */
    const targetPosition = (0, _utilities.normalizeSnapPoint)(position, containerHeight);

    /**
     * exit method if :
     * - layout is not calculated.
     * - already animating to next position.
     * - sheet is forced closing.
     */
    const {
      nextPosition,
      isForcedClosing
    } = animatedAnimationState.get();
    if (!isLayoutCalculated || targetPosition === nextPosition || isForcedClosing) {
      return;
    }

    /**
     * mark the new position as temporary.
     */
    isInTemporaryPosition.value = true;
    (0, _reactNativeReanimated.runOnUI)(animateToPosition)(targetPosition, _constants.ANIMATION_SOURCE.USER, 0, animationConfigs);
  }, [animateToPosition, isInTemporaryPosition, isLayoutCalculated, animatedLayoutState, animatedAnimationState]);
  const handleClose = (0, _react.useCallback)(function handleClose(animationConfigs) {
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheet',
        method: 'handleClose'
      });
    }
    const closedDetentPosition = animatedDetentsState.get().closedDetentPosition;
    if (closedDetentPosition === undefined) {
      return;
    }
    const targetPosition = closedDetentPosition;

    /**
     * exit method if :
     * - layout is not calculated.
     * - already animating to next position.
     * - sheet is forced closing.
     */
    const {
      nextPosition,
      isForcedClosing
    } = animatedAnimationState.get();
    if (!isLayoutCalculated.value || targetPosition === nextPosition || isForcedClosing) {
      return;
    }

    /**
     * reset temporary position variable.
     */
    isInTemporaryPosition.value = false;
    (0, _reactNativeReanimated.runOnUI)(animateToPosition)(targetPosition, _constants.ANIMATION_SOURCE.USER, 0, animationConfigs);
  }, [animateToPosition, isLayoutCalculated, isInTemporaryPosition, animatedDetentsState, animatedAnimationState]);
  const handleForceClose = (0, _react.useCallback)(function handleForceClose(animationConfigs) {
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheet',
        method: 'handleForceClose'
      });
    }
    const closedDetentPosition = animatedDetentsState.get().closedDetentPosition;
    if (closedDetentPosition === undefined) {
      return;
    }
    const targetPosition = closedDetentPosition;

    /**
     * exit method if :
     * - already animating to next position.
     * - sheet is forced closing.
     */
    const {
      nextPosition,
      isForcedClosing
    } = animatedAnimationState.get();
    if (targetPosition === nextPosition || isForcedClosing) {
      return;
    }

    /**
     * reset temporary position variable.
     */
    isInTemporaryPosition.value = false;

    /**
     * set force closing variable.
     */
    animatedAnimationState.set(state => {
      'worklet';

      return {
        ...state,
        isForcedClosing: true
      };
    });
    (0, _reactNativeReanimated.runOnUI)(animateToPosition)(targetPosition, _constants.ANIMATION_SOURCE.USER, 0, animationConfigs);
  }, [animateToPosition, isInTemporaryPosition, animatedDetentsState, animatedAnimationState]);
  const handleExpand = (0, _react.useCallback)(function handleExpand(animationConfigs) {
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheet',
        method: 'handleExpand'
      });
    }
    const {
      detents
    } = animatedDetentsState.get();
    if (detents === undefined || detents.length === 0) {
      return;
    }
    const targetIndex = detents.length - 1;
    const targetPosition = detents[targetIndex];

    /**
     * exit method if :
     * - layout is not calculated.
     * - already animating to next position.
     * - sheet is forced closing.
     */
    const {
      nextPosition,
      nextIndex,
      isForcedClosing
    } = animatedAnimationState.get();
    if (!isLayoutCalculated.value || targetIndex === nextIndex || targetPosition === nextPosition || isForcedClosing) {
      return;
    }

    /**
     * reset temporary position boolean.
     */
    isInTemporaryPosition.value = false;
    (0, _reactNativeReanimated.runOnUI)(animateToPosition)(targetPosition, _constants.ANIMATION_SOURCE.USER, 0, animationConfigs);
  }, [animateToPosition, isInTemporaryPosition, isLayoutCalculated, animatedDetentsState, animatedAnimationState]);
  const handleCollapse = (0, _react.useCallback)(function handleCollapse(animationConfigs) {
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheet',
        method: 'handleCollapse'
      });
    }
    const {
      detents
    } = animatedDetentsState.get();
    if (detents === undefined || detents.length === 0) {
      return;
    }
    const targetPosition = detents[0];

    /**
     * exit method if :
     * - layout is not calculated.
     * - already animating to next position.
     * - sheet is forced closing.
     */
    const {
      nextPosition,
      nextIndex,
      isForcedClosing
    } = animatedAnimationState.get();
    if (!isLayoutCalculated || nextIndex === 0 || targetPosition === nextPosition || isForcedClosing) {
      return;
    }

    /**
     * reset temporary position boolean.
     */
    isInTemporaryPosition.value = false;
    (0, _reactNativeReanimated.runOnUI)(animateToPosition)(targetPosition, _constants.ANIMATION_SOURCE.USER, 0, animationConfigs);
  }, [animateToPosition, isLayoutCalculated, isInTemporaryPosition, animatedDetentsState, animatedAnimationState]);
  (0, _react.useImperativeHandle)(ref, () => ({
    snapToIndex: handleSnapToIndex,
    snapToPosition: handleSnapToPosition,
    expand: handleExpand,
    collapse: handleCollapse,
    close: handleClose,
    forceClose: handleForceClose
  }));
  //#endregion

  //#region contexts variables
  const internalContextVariables = (0, _react.useMemo)(() => ({
    textInputNodesRef,
    enableContentPanningGesture,
    enableDynamicSizing,
    overDragResistanceFactor,
    enableOverDrag,
    enablePanDownToClose,
    animatedAnimationState,
    animatedSheetState,
    animatedScrollableState,
    animatedScrollableStatus,
    animatedContentGestureState,
    animatedHandleGestureState,
    animatedKeyboardState,
    animatedLayoutState,
    animatedIndex,
    animatedPosition,
    animatedSheetHeight,
    animatedDetentsState,
    isInTemporaryPosition,
    simultaneousHandlers: _providedSimultaneousHandlers,
    waitFor: _providedWaitFor,
    activeOffsetX: _providedActiveOffsetX,
    activeOffsetY: _providedActiveOffsetY,
    failOffsetX: _providedFailOffsetX,
    failOffsetY: _providedFailOffsetY,
    enableBlurKeyboardOnGesture,
    animateToPosition,
    stopAnimation,
    setScrollableRef,
    removeScrollableRef
  }), [textInputNodesRef, animatedIndex, animatedPosition, animatedSheetHeight, animatedLayoutState, animatedContentGestureState, animatedHandleGestureState, animatedAnimationState, animatedKeyboardState, animatedSheetState, animatedScrollableState, animatedScrollableStatus, animatedDetentsState, isInTemporaryPosition, enableContentPanningGesture, overDragResistanceFactor, enableOverDrag, enablePanDownToClose, enableDynamicSizing, enableBlurKeyboardOnGesture, _providedSimultaneousHandlers, _providedWaitFor, _providedActiveOffsetX, _providedActiveOffsetY, _providedFailOffsetX, _providedFailOffsetY, setScrollableRef, removeScrollableRef, animateToPosition, stopAnimation]);
  const externalContextVariables = (0, _react.useMemo)(() => ({
    animatedIndex,
    animatedPosition,
    snapToIndex: handleSnapToIndex,
    snapToPosition: handleSnapToPosition,
    expand: handleExpand,
    collapse: handleCollapse,
    close: handleClose,
    forceClose: handleForceClose
  }), [animatedIndex, animatedPosition, handleSnapToIndex, handleSnapToPosition, handleExpand, handleCollapse, handleClose, handleForceClose]);
  //#endregion

  //#region effects
  (0, _reactNativeReanimated.useAnimatedReaction)(() => animatedLayoutState.get().containerHeight, (result, previous) => {
    if (result === _constants.INITIAL_LAYOUT_VALUE) {
      return;
    }
    animatedContainerHeightDidChange.value = result !== previous;
    const {
      closedDetentPosition
    } = animatedDetentsState.get();
    if (closedDetentPosition === undefined) {
      return;
    }

    /**
     * When user close the bottom sheet while the keyboard open on Android with
     * software keyboard layout mode set to resize, the close position would be
     * set to the container height - the keyboard height, and when the keyboard
     * closes, the container height and here we restart the animation again.
     *
     * [read more](https://github.com/gorhom/react-native-bottom-sheet/issues/2163)
     */
    const {
      status: animationStatus,
      source: animationSource,
      nextIndex
    } = animatedAnimationState.get();
    if (animationStatus === _constants.ANIMATION_STATUS.RUNNING && animationSource === _constants.ANIMATION_SOURCE.GESTURE && nextIndex === -1) {
      animateToPosition(closedDetentPosition, _constants.ANIMATION_SOURCE.GESTURE);
    }
  }, [animatedContainerHeightDidChange, animatedAnimationState, animatedDetentsState]);

  /**
   * Reaction to the `snapPoints` change, to insure that the sheet position reflect
   * to the current point correctly.
   *
   * @alias OnSnapPointsChange
   */
  (0, _reactNativeReanimated.useAnimatedReaction)(() => animatedDetentsState.get().detents, (result, previous) => {
    /**
     * if values did not change, and did handle on mount animation
     * then we early exit the method.
     */
    if (JSON.stringify(result) === JSON.stringify(previous) && didAnimateOnMount.value) {
      return;
    }

    /**
     * if layout is not calculated yet, then we exit the method.
     */
    if (!isLayoutCalculated.value) {
      return;
    }
    if (__DEV__) {
      (0, _reactNativeReanimated.runOnJS)(_utilities.print)({
        component: 'BottomSheet',
        method: 'useAnimatedReaction::OnSnapPointChange',
        category: 'effect',
        params: {
          result
        }
      });
    }
    evaluatePosition(_constants.ANIMATION_SOURCE.SNAP_POINT_CHANGE);
  }, [isLayoutCalculated, didAnimateOnMount, animatedDetentsState]);

  /**
   * Reaction to the keyboard state change.
   *
   * @alias OnKeyboardStateChange
   */
  (0, _reactNativeReanimated.useAnimatedReaction)(() => animatedKeyboardState.get().status + animatedKeyboardState.get().height, (result, _previousResult) => {
    /**
     * if keyboard state is equal to the previous state, then exit the method
     */
    if (result === _previousResult) {
      return;
    }
    const {
      status,
      height,
      easing,
      duration,
      target
    } = animatedKeyboardState.get();

    /**
     * if state is undetermined, then we early exit.
     */
    if (status === _constants.KEYBOARD_STATUS.UNDETERMINED) {
      return;
    }
    const {
      status: animationStatus,
      source: animationSource
    } = animatedAnimationState.get();
    /**
     * if keyboard is hidden by customer gesture, then we early exit.
     */
    if (status === _constants.KEYBOARD_STATUS.HIDDEN && animationStatus === _constants.ANIMATION_STATUS.RUNNING && animationSource === _constants.ANIMATION_SOURCE.GESTURE) {
      return;
    }

    /**
     * Calculate the keyboard height in the container.
     */
    const containerOffset = animatedLayoutState.get().containerOffset;
    let heightWithinContainer = height === 0 ? 0 : $modal ? Math.abs(height - Math.abs(bottomInset - containerOffset.bottom)) : Math.abs(height - containerOffset.bottom);
    if (__DEV__) {
      (0, _reactNativeReanimated.runOnJS)(_utilities.print)({
        component: 'BottomSheet',
        method: 'useAnimatedReaction::OnKeyboardStateChange',
        category: 'effect',
        params: {
          status,
          height,
          heightWithinContainer,
          containerOffset
        }
      });
    }

    /**
     * if platform is android and the input mode is resize, then exit the method
     */
    if (_reactNative.Platform.OS === 'android' && android_keyboardInputMode === _constants.KEYBOARD_INPUT_MODE.adjustResize) {
      heightWithinContainer = 0;
      if (keyboardBehavior === _constants.KEYBOARD_BEHAVIOR.interactive) {
        animatedKeyboardState.set({
          target,
          status,
          height,
          easing,
          duration,
          heightWithinContainer
        });
        return;
      }
    }
    animatedKeyboardState.set(state => ({
      ...state,
      heightWithinContainer
    }));

    /**
     * if user is interacting with sheet, then exit the method
     */
    const hasActiveGesture = animatedContentGestureState.value === _reactNativeGestureHandler.State.ACTIVE || animatedContentGestureState.value === _reactNativeGestureHandler.State.BEGAN || animatedHandleGestureState.value === _reactNativeGestureHandler.State.ACTIVE || animatedHandleGestureState.value === _reactNativeGestureHandler.State.BEGAN;
    if (hasActiveGesture) {
      return;
    }

    /**
     * if new keyboard state is hidden and blur behavior is none, then exit the method
     */
    if (status === _constants.KEYBOARD_STATUS.HIDDEN && keyboardBlurBehavior === _constants.KEYBOARD_BLUR_BEHAVIOR.none) {
      return;
    }
    const animationConfigs = (0, _utilities.getKeyboardAnimationConfigs)(easing, duration);
    evaluatePosition(_constants.ANIMATION_SOURCE.KEYBOARD, animationConfigs);
  }, [$modal, bottomInset, keyboardBehavior, keyboardBlurBehavior, android_keyboardInputMode, animatedKeyboardState, animatedLayoutState, getEvaluatedPosition]);

  /**
   * sets provided animated position
   */
  (0, _reactNativeReanimated.useAnimatedReaction)(() => animatedPosition.value, _animatedPosition => {
    if (_providedAnimatedPosition) {
      _providedAnimatedPosition.value = _animatedPosition + topInset;
    }
  }, [_providedAnimatedPosition, topInset]);

  /**
   * sets provided animated index
   */
  (0, _reactNativeReanimated.useAnimatedReaction)(() => animatedIndex.value, _animatedIndex => {
    if (_providedAnimatedIndex) {
      _providedAnimatedIndex.value = _animatedIndex;
    }
  }, [_providedAnimatedIndex]);

  /**
   * React to `index` prop to snap the sheet to the new position.
   *
   * @alias onIndexChange
   */
  (0, _react.useEffect)(() => {
    // early exit, if animate on mount is set and it did not animate yet.
    if (animateOnMount && !didAnimateOnMount.value) {
      return;
    }
    handleSnapToIndex(_providedIndex);
  }, [animateOnMount, _providedIndex, didAnimateOnMount, handleSnapToIndex]);
  //#endregion

  // render
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_contexts.BottomSheetProvider, {
    value: externalContextVariables,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_contexts.BottomSheetInternalProvider, {
      value: internalContextVariables,
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_bottomSheetGestureHandlersProvider.default, {
        gestureEventsHandlersHook: gestureEventsHandlersHook,
        children: [BackdropComponent ? /*#__PURE__*/(0, _jsxRuntime.jsx)(BackdropComponent, {
          animatedIndex: animatedIndex,
          animatedPosition: animatedPosition,
          style: _reactNative.StyleSheet.absoluteFill
        }) : null, /*#__PURE__*/(0, _jsxRuntime.jsx)(_bottomSheetHostingContainer.BottomSheetHostingContainer, {
          shouldCalculateHeight: !$modal,
          layoutState: animatedLayoutState,
          containerLayoutState: containerLayoutState,
          topInset: topInset,
          bottomInset: bottomInset,
          detached: detached,
          style: _providedContainerStyle,
          children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_BottomSheetBody.BottomSheetBody, {
            style: style,
            children: [backgroundComponent === null ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_bottomSheetBackground.BottomSheetBackgroundContainer, {
              animatedIndex: animatedIndex,
              animatedPosition: animatedPosition,
              backgroundComponent: backgroundComponent,
              backgroundStyle: _providedBackgroundStyle
            }, "BottomSheetBackgroundContainer"), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_BottomSheetContent.BottomSheetContent, {
              pointerEvents: "box-none",
              accessible: _providedAccessible ?? undefined,
              accessibilityRole: _providedAccessibilityRole ?? undefined,
              accessibilityLabel: _providedAccessibilityLabel ?? undefined,
              keyboardBehavior: keyboardBehavior,
              detached: detached,
              children: [children, footerComponent ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_bottomSheetFooter.BottomSheetFooterContainer, {
                footerComponent: footerComponent
              }) : null]
            }), handleComponent !== null ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_bottomSheetHandle.BottomSheetHandleContainer, {
              animatedIndex: animatedIndex,
              animatedPosition: animatedPosition,
              enableHandlePanningGesture: enableHandlePanningGesture,
              enableOverDrag: enableOverDrag,
              enablePanDownToClose: enablePanDownToClose,
              overDragResistanceFactor: overDragResistanceFactor,
              keyboardBehavior: keyboardBehavior,
              handleComponent: handleComponent,
              handleStyle: _providedHandleStyle,
              handleIndicatorStyle: _providedHandleIndicatorStyle
            }, "BottomSheetHandleContainer") : null]
          })
        }, "BottomSheetContainer")]
      })
    })
  });
});
const BottomSheet = /*#__PURE__*/(0, _react.memo)(BottomSheetComponent);
BottomSheet.displayName = 'BottomSheet';
var _default = exports.default = BottomSheet;
//# sourceMappingURL=BottomSheet.js.map