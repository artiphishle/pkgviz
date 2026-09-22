"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeReanimated = require("react-native-reanimated");
var _constants = require("../../constants");
var _contexts = require("../../contexts");
var _hooks = require("../../hooks");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const BottomSheetGestureHandlersProvider = ({
  gestureEventsHandlersHook: useGestureEventsHandlers = _hooks.useGestureEventsHandlersDefault,
  children
}) => {
  //#region variables
  const animatedGestureSource = (0, _reactNativeReanimated.useSharedValue)(_constants.GESTURE_SOURCE.UNDETERMINED);
  //#endregion

  //#region hooks
  const {
    animatedContentGestureState,
    animatedHandleGestureState
  } = (0, _hooks.useBottomSheetInternal)();
  const {
    handleOnStart,
    handleOnChange,
    handleOnEnd,
    handleOnFinalize
  } = useGestureEventsHandlers();
  //#endregion

  //#region gestures
  const contentPanGestureHandler = (0, _hooks.useGestureHandler)(_constants.GESTURE_SOURCE.CONTENT, animatedContentGestureState, animatedGestureSource, handleOnStart, handleOnChange, handleOnEnd, handleOnFinalize);
  const handlePanGestureHandler = (0, _hooks.useGestureHandler)(_constants.GESTURE_SOURCE.HANDLE, animatedHandleGestureState, animatedGestureSource, handleOnStart, handleOnChange, handleOnEnd, handleOnFinalize);
  //#endregion

  //#region context
  const contextValue = (0, _react.useMemo)(() => ({
    contentPanGestureHandler,
    handlePanGestureHandler,
    animatedGestureSource
  }), [contentPanGestureHandler, handlePanGestureHandler, animatedGestureSource]);
  //#endregion
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_contexts.BottomSheetGestureHandlersContext.Provider, {
    value: contextValue,
    children: children
  });
};
var _default = exports.default = BottomSheetGestureHandlersProvider;
//# sourceMappingURL=BottomSheetGestureHandlersProvider.js.map