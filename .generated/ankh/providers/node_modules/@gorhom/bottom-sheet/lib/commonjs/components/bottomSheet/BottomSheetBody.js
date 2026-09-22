"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BottomSheetBody = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _hooks = require("../../hooks");
var _styles = require("./styles");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function BottomSheetBodyComponent({
  style,
  children
}) {
  //#region hooks
  const {
    animatedIndex,
    animatedPosition
  } = (0, _hooks.useBottomSheetInternal)();
  //#endregion

  //#region styles
  const containerAnimatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    opacity: _reactNative.Platform.OS === 'android' && animatedIndex.get() === -1 ? 0 : 1,
    transform: [{
      translateY: animatedPosition.get()
    }]
  }), [animatedPosition, animatedIndex]);
  const containerStyle = (0, _react.useMemo)(() => [style, _styles.styles.container, containerAnimatedStyle], [style, containerAnimatedStyle]);
  //#endregion

  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
    style: containerStyle,
    collapsable: true,
    children: children
  });
}
const BottomSheetBody = exports.BottomSheetBody = /*#__PURE__*/(0, _react.memo)(BottomSheetBodyComponent);
BottomSheetBody.displayName = 'BottomSheetBody';
//# sourceMappingURL=BottomSheetBody.js.map