"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BottomSheetContent = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _constants = require("../../constants");
var _hooks = require("../../hooks");
var _utilities = require("../../utilities");
var _bottomSheetDraggableView = _interopRequireDefault(require("../bottomSheetDraggableView"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function BottomSheetContentComponent({
  detached,
  animationConfigs,
  overrideReduceMotion,
  keyboardBehavior,
  accessible,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  children
}) {
  //#region hooks
  const {
    enableDynamicSizing,
    overDragResistanceFactor,
    enableContentPanningGesture,
    animatedPosition,
    animatedLayoutState,
    animatedDetentsState,
    animatedSheetHeight,
    animatedKeyboardState,
    isInTemporaryPosition
  } = (0, _hooks.useBottomSheetInternal)();
  //#endregion

  //#region variables
  const animatedContentHeightMax = (0, _reactNativeReanimated.useDerivedValue)(() => {
    const {
      containerHeight,
      handleHeight
    } = animatedLayoutState.get();

    /**
     * if container height is not yet calculated, then we exit the method
     */
    if (containerHeight === _constants.INITIAL_LAYOUT_VALUE) {
      return 0;
    }
    const {
      status: keyboardStatus,
      heightWithinContainer: keyboardHeightWithinContainer
    } = animatedKeyboardState.get();
    let contentHeight = animatedSheetHeight.get() - Math.max(0, handleHeight);
    switch (keyboardBehavior) {
      case _constants.KEYBOARD_BEHAVIOR.extend:
        if (keyboardStatus === _constants.KEYBOARD_STATUS.SHOWN) {
          contentHeight = contentHeight - keyboardHeightWithinContainer;
        }
        break;
      case _constants.KEYBOARD_BEHAVIOR.fillParent:
        if (!isInTemporaryPosition.get()) {
          break;
        }
        if (keyboardStatus === _constants.KEYBOARD_STATUS.SHOWN) {
          contentHeight = containerHeight - handleHeight - keyboardHeightWithinContainer;
        } else {
          contentHeight = containerHeight - handleHeight;
        }
        break;
      case _constants.KEYBOARD_BEHAVIOR.interactive:
        {
          if (!isInTemporaryPosition.get()) {
            break;
          }
          const contentWithKeyboardHeight = contentHeight + keyboardHeightWithinContainer;
          if (keyboardStatus === _constants.KEYBOARD_STATUS.SHOWN) {
            if (keyboardHeightWithinContainer + animatedSheetHeight.get() > containerHeight) {
              contentHeight = containerHeight - keyboardHeightWithinContainer - handleHeight;
            }
          } else if (contentWithKeyboardHeight + handleHeight > containerHeight) {
            contentHeight = containerHeight - handleHeight;
          } else {
            contentHeight = contentWithKeyboardHeight;
          }
          break;
        }
    }

    /**
     * before the container is measured, `contentHeight` value will be below zero,
     * which will lead to freeze the scrollable.
     *
     * @link (https://github.com/gorhom/react-native-bottom-sheet/issues/470)
     */
    return Math.max(contentHeight, 0);
  }, [animatedLayoutState, animatedKeyboardState, animatedSheetHeight, isInTemporaryPosition, keyboardBehavior]);
  const animatedPaddingBottom = (0, _reactNativeReanimated.useDerivedValue)(() => {
    const containerHeight = animatedLayoutState.get().containerHeight;
    /**
     * if container height is not yet calculated, then we exit the method
     */
    if (containerHeight === _constants.INITIAL_LAYOUT_VALUE) {
      return 0;
    }
    const {
      highestDetentPosition
    } = animatedDetentsState.get();
    const highestSnapPoint = Math.max(highestDetentPosition ?? 0, animatedPosition.get());
    /**
     * added safe area to prevent the sheet from floating above
     * the bottom of the screen, when sheet being over dragged or
     * when the sheet is resized.
     */
    const overDragSafePaddingBottom = Math.sqrt(highestSnapPoint - containerHeight * -1) * overDragResistanceFactor;
    let paddingBottom = overDragSafePaddingBottom;

    /**
     * if keyboard is open, then we try to add padding to prevent content
     * from being covered by the keyboard.
     */
    const {
      status: keyboardStatus,
      heightWithinContainer: keyboardHeightWithinContainer
    } = animatedKeyboardState.get();
    if (keyboardStatus === _constants.KEYBOARD_STATUS.SHOWN) {
      paddingBottom = overDragSafePaddingBottom + keyboardHeightWithinContainer;
    }
    return paddingBottom;
  }, [overDragResistanceFactor, animatedPosition, animatedLayoutState, animatedDetentsState, animatedKeyboardState]);
  //#endregion

  //#region styles
  const contentMaskContainerAnimatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    const {
      containerHeight,
      contentHeight
    } = animatedLayoutState.get();
    /**
     * if container height is not yet calculated, then we exit the method
     */
    if (containerHeight === _constants.INITIAL_LAYOUT_VALUE) {
      return {};
    }

    /**
     * if dynamic sizing is enabled, and content height
     * is still not set, then we exit method.
     */
    if (enableDynamicSizing && contentHeight === _constants.INITIAL_LAYOUT_VALUE) {
      return {};
    }
    const paddingBottom = detached ? 0 : animatedPaddingBottom.get();
    const height = animatedContentHeightMax.get() + paddingBottom;
    return {
      paddingBottom: (0, _utilities.animate)({
        point: paddingBottom,
        configs: animationConfigs,
        overrideReduceMotion
      }),
      height: (0, _utilities.animate)({
        point: height,
        configs: animationConfigs,
        overrideReduceMotion
      })
    };
  }, [overDragResistanceFactor, enableDynamicSizing, detached, animationConfigs, overrideReduceMotion, animatedLayoutState, animatedContentHeightMax, animatedLayoutState]);
  const contentContainerStyle = (0, _react.useMemo)(() => [detached ? {
    overflow: 'visible'
  } : {
    overflow: 'hidden'
  }, contentMaskContainerAnimatedStyle], [contentMaskContainerAnimatedStyle, detached]);
  //#endregion

  //#region render
  const DraggableView = enableContentPanningGesture ? _bottomSheetDraggableView.default : _reactNativeReanimated.default.View;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(DraggableView, {
    accessible: accessible,
    accessibilityLabel: accessibilityLabel,
    accessibilityHint: accessibilityHint,
    accessibilityRole: accessibilityRole,
    style: contentContainerStyle,
    children: children
  });
  //#endregion
}
const BottomSheetContent = exports.BottomSheetContent = /*#__PURE__*/(0, _react.memo)(BottomSheetContentComponent);
BottomSheetContent.displayName = 'BottomSheetContent';
//# sourceMappingURL=BottomSheetContent.js.map