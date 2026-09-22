"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BottomSheetBackgroundContainer = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _BottomSheetBackground = require("./BottomSheetBackground");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const BottomSheetBackgroundContainerComponent = ({
  animatedIndex,
  animatedPosition,
  backgroundComponent: _providedBackgroundComponent,
  backgroundStyle: _providedBackgroundStyle
}) => {
  //#region style
  const backgroundStyle = (0, _react.useMemo)(() => [_reactNative.StyleSheet.absoluteFill, _providedBackgroundStyle], [_providedBackgroundStyle]);
  //#endregion

  const BackgroundComponent = _providedBackgroundComponent ?? _BottomSheetBackground.BottomSheetBackground;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(BackgroundComponent, {
    pointerEvents: "none",
    animatedIndex: animatedIndex,
    animatedPosition: animatedPosition,
    style: backgroundStyle
  });
};
const BottomSheetBackgroundContainer = exports.BottomSheetBackgroundContainer = /*#__PURE__*/(0, _react.memo)(BottomSheetBackgroundContainerComponent);
BottomSheetBackgroundContainer.displayName = 'BottomSheetBackgroundContainer';
//# sourceMappingURL=BottomSheetBackgroundContainer.js.map