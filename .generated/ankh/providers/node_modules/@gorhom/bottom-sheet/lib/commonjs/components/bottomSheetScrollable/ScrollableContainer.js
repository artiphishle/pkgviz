"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollableContainer = void 0;
var _react = _interopRequireWildcard(require("react"));
var _BottomSheetDraggableScrollable = require("./BottomSheetDraggableScrollable");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const ScrollableContainer = exports.ScrollableContainer = /*#__PURE__*/(0, _react.forwardRef)(function ScrollableContainer({
  nativeGesture,
  ScrollableComponent,
  ...rest
}, ref) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_BottomSheetDraggableScrollable.BottomSheetDraggableScrollable, {
    scrollableGesture: nativeGesture,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(ScrollableComponent, {
      ref: ref,
      ...rest
    })
  });
});
//# sourceMappingURL=ScrollableContainer.js.map