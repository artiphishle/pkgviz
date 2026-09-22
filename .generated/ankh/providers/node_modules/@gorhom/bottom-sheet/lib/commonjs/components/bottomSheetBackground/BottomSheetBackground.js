"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BottomSheetBackground = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _styles = require("./styles");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const BottomSheetBackgroundComponent = ({
  pointerEvents,
  style
}) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
  pointerEvents: pointerEvents,
  accessible: true,
  accessibilityRole: "adjustable",
  accessibilityLabel: "Bottom Sheet",
  style: [_styles.styles.background, style]
});
const BottomSheetBackground = exports.BottomSheetBackground = /*#__PURE__*/(0, _react.memo)(BottomSheetBackgroundComponent);
BottomSheetBackground.displayName = 'BottomSheetBackground';
//# sourceMappingURL=BottomSheetBackground.js.map