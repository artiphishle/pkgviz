"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BottomSheetFlashList = void 0;
var _react = _interopRequireWildcard(require("react"));
var _BottomSheetScrollView = _interopRequireDefault(require("./BottomSheetScrollView"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * Minimal subset of FlashListProps needed for BottomSheetFlashList.
 * Defined locally to avoid requiring @shopify/flash-list as a dependency,
 * since the runtime import is optional (try/catch require).
 */

let FlashList;
// since FlashList is not a dependency for the library
// we try to import it using metro optional import
try {
  FlashList = require('@shopify/flash-list');
} catch (_) {}
const BottomSheetFlashListComponent = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  //#region props
  const {
    focusHook,
    scrollEventsHandlersHook,
    enableFooterMarginAdjustment,
    ...rest
    // biome-ignore lint: to be addressed!
  } = props;
  //#endregion

  (0, _react.useMemo)(() => {
    if (!FlashList) {
      throw 'You need to install FlashList first, `yarn install @shopify/flash-list`';
    }
    console.warn('BottomSheetFlashList is deprecated, please use useBottomSheetScrollableCreator instead.');
  }, []);

  //#region render
  const renderScrollComponent = (0, _react.useMemo)(() => /*#__PURE__*/(0, _react.forwardRef)(
  // @ts-expect-error
  ({
    data,
    ...props
  }, ref) => {
    return (
      /*#__PURE__*/
      // @ts-expect-error
      (0, _jsxRuntime.jsx)(_BottomSheetScrollView.default, {
        ref: ref,
        ...props,
        focusHook: focusHook,
        scrollEventsHandlersHook: scrollEventsHandlersHook,
        enableFooterMarginAdjustment: enableFooterMarginAdjustment
      })
    );
  }), [focusHook, scrollEventsHandlersHook, enableFooterMarginAdjustment]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(FlashList.FlashList, {
    ref: ref,
    renderScrollComponent: renderScrollComponent,
    ...rest
  });
  //#endregion
});
const BottomSheetFlashList = exports.BottomSheetFlashList = /*#__PURE__*/(0, _react.memo)(BottomSheetFlashListComponent);
var _default = exports.default = BottomSheetFlashList;
//# sourceMappingURL=BottomSheetFlashList.js.map