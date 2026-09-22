"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BottomSheetBackdrop = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _hooks = require("../../hooks");
var _constants = require("./constants");
var _styles = require("./styles");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const BottomSheetBackdropComponent = ({
  animatedIndex,
  opacity: _providedOpacity,
  appearsOnIndex: _providedAppearsOnIndex,
  disappearsOnIndex: _providedDisappearsOnIndex,
  enableTouchThrough: _providedEnableTouchThrough,
  pressBehavior = _constants.DEFAULT_PRESS_BEHAVIOR,
  onPress,
  style,
  children,
  accessible: _providedAccessible = _constants.DEFAULT_ACCESSIBLE,
  accessibilityRole: _providedAccessibilityRole = _constants.DEFAULT_ACCESSIBILITY_ROLE,
  accessibilityLabel: _providedAccessibilityLabel = _constants.DEFAULT_ACCESSIBILITY_LABEL,
  accessibilityHint: _providedAccessibilityHint = _constants.DEFAULT_ACCESSIBILITY_HINT
}) => {
  //#region hooks
  const {
    snapToIndex,
    close
  } = (0, _hooks.useBottomSheet)();
  const isMounted = (0, _react.useRef)(false);
  //#endregion

  //#region defaults
  const opacity = _providedOpacity ?? _constants.DEFAULT_OPACITY;
  const appearsOnIndex = _providedAppearsOnIndex ?? _constants.DEFAULT_APPEARS_ON_INDEX;
  const disappearsOnIndex = _providedDisappearsOnIndex ?? _constants.DEFAULT_DISAPPEARS_ON_INDEX;
  const enableTouchThrough = _providedEnableTouchThrough ?? _constants.DEFAULT_ENABLE_TOUCH_THROUGH;
  //#endregion

  //#region variables
  const [pointerEvents, setPointerEvents] = (0, _react.useState)(enableTouchThrough ? 'none' : 'auto');
  //#endregion

  //#region callbacks
  const handleOnPress = (0, _react.useCallback)(() => {
    onPress?.();
    if (pressBehavior === 'close') {
      close();
    } else if (pressBehavior === 'collapse') {
      snapToIndex(disappearsOnIndex);
    } else if (typeof pressBehavior === 'number') {
      snapToIndex(pressBehavior);
    }
  }, [snapToIndex, close, disappearsOnIndex, pressBehavior, onPress]);
  const handleContainerTouchability = (0, _react.useCallback)(shouldDisableTouchability => {
    isMounted.current && setPointerEvents(shouldDisableTouchability ? 'none' : 'auto');
  }, []);
  //#endregion

  //#region tap gesture
  const tapHandler = (0, _react.useMemo)(() => {
    const gesture = _reactNativeGestureHandler.Gesture.Tap().onEnd(() => {
      (0, _reactNativeReanimated.runOnJS)(handleOnPress)();
    });
    return gesture;
  }, [handleOnPress]);
  //#endregion

  //#region styles
  const containerAnimatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    opacity: (0, _reactNativeReanimated.interpolate)(animatedIndex.value, [-1, disappearsOnIndex, appearsOnIndex], [0, 0, opacity], _reactNativeReanimated.Extrapolation.CLAMP)
  }), [animatedIndex, appearsOnIndex, disappearsOnIndex, opacity]);
  const containerStyle = (0, _react.useMemo)(() => [_reactNative.StyleSheet.absoluteFill, _styles.styles.backdrop, style, containerAnimatedStyle], [style, containerAnimatedStyle]);
  //#endregion

  //#region effects
  (0, _reactNativeReanimated.useAnimatedReaction)(() => animatedIndex.value <= disappearsOnIndex, (shouldDisableTouchability, previous) => {
    if (shouldDisableTouchability === previous) {
      return;
    }
    (0, _reactNativeReanimated.runOnJS)(handleContainerTouchability)(shouldDisableTouchability);
  }, [disappearsOnIndex]);

  // addressing updating the state after unmounting.
  // [link](https://github.com/gorhom/react-native-bottom-sheet/issues/1376)
  (0, _react.useEffect)(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  //#endregion

  const AnimatedView = /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
    style: containerStyle,
    pointerEvents: pointerEvents,
    accessible: _providedAccessible ?? undefined,
    accessibilityRole: _providedAccessibilityRole ?? undefined,
    accessibilityLabel: _providedAccessibilityLabel ?? undefined,
    accessibilityHint: _providedAccessibilityHint ? _providedAccessibilityHint : `Tap to ${typeof pressBehavior === 'string' ? pressBehavior : 'move'} the Bottom Sheet`,
    children: children
  });
  return pressBehavior !== 'none' ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeGestureHandler.GestureDetector, {
    gesture: tapHandler,
    children: AnimatedView
  }) : AnimatedView;
};
const BottomSheetBackdrop = exports.BottomSheetBackdrop = /*#__PURE__*/(0, _react.memo)(BottomSheetBackdropComponent);
BottomSheetBackdrop.displayName = 'BottomSheetBackdrop';
//# sourceMappingURL=BottomSheetBackdrop.js.map