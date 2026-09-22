"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _constants = require("../../constants");
var _gesture = require("../../contexts/gesture");
var _hooks = require("../../hooks");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const AnimatedRefreshControl = _reactNativeReanimated.default.createAnimatedComponent(_reactNative.RefreshControl);
function BottomSheetRefreshControlComponent({
  onRefresh,
  scrollableGesture,
  ...rest
}) {
  //#region hooks
  const draggableGesture = (0, _react.useContext)(_gesture.BottomSheetDraggableContext);
  const {
    animatedScrollableStatus: animatedScrollableState,
    enableContentPanningGesture
  } = (0, _hooks.useBottomSheetInternal)();
  //#endregion

  if (!draggableGesture && enableContentPanningGesture) {
    throw "'BottomSheetRefreshControl' cannot be used out of the BottomSheet!";
  }

  //#region variables
  const animatedProps = (0, _reactNativeReanimated.useAnimatedProps)(() => ({
    enabled: animatedScrollableState.value === _constants.SCROLLABLE_STATUS.UNLOCKED
  }), [animatedScrollableState.value]);
  const gesture = (0, _react.useMemo)(() => draggableGesture ? _reactNativeGestureHandler.Gesture.Native().simultaneousWithExternalGesture(...draggableGesture.toGestureArray(), ...scrollableGesture.toGestureArray()).shouldCancelWhenOutside(true) : undefined, [draggableGesture, scrollableGesture]);

  //#endregion

  // render
  if (gesture) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeGestureHandler.GestureDetector, {
      gesture: gesture,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(AnimatedRefreshControl, {
        ...rest,
        onRefresh: onRefresh,
        animatedProps: animatedProps
      })
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(AnimatedRefreshControl, {
    ...rest,
    onRefresh: onRefresh,
    animatedProps: animatedProps
  });
}
const BottomSheetRefreshControl = /*#__PURE__*/(0, _react.memo)(BottomSheetRefreshControlComponent);
BottomSheetRefreshControl.displayName = 'BottomSheetRefreshControl';
var _default = exports.default = BottomSheetRefreshControl;
//# sourceMappingURL=BottomSheetRefreshControl.android.js.map