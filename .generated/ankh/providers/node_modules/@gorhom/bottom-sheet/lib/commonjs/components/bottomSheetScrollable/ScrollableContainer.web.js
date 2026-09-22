"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollableContainer = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeReanimated = _interopRequireDefault(require("react-native-reanimated"));
var _constants = require("../../constants");
var _hooks = require("../../hooks");
var _BottomSheetDraggableScrollable = require("./BottomSheetDraggableScrollable");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * Detect if the current browser is Safari or not.
 */
const isWebkit = () => {
  // @ts-expect-error
  return navigator.userAgent.indexOf('Safari') > -1;
};
const ScrollableContainer = exports.ScrollableContainer = /*#__PURE__*/(0, _react.forwardRef)(function ScrollableContainer({
  nativeGesture,
  ScrollableComponent,
  animatedProps,
  setContentSize,
  onLayout,
  ...rest
}, ref) {
  //#region refs
  const isInitialContentHeightCaptured = (0, _react.useRef)(false);
  //#endregion

  //#region hooks
  const {
    animatedLayoutState
  } = (0, _hooks.useBottomSheetInternal)();
  //#endregion

  //#region callbacks
  const renderScrollComponent = (0, _react.useCallback)(props => /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.ScrollView, {
    ...props,
    animatedProps: animatedProps
  }), [animatedProps]);

  /**
   * A workaround a bug in React Native Web [#1502](https://github.com/necolas/react-native-web/issues/1502),
   * where the `onContentSizeChange` won't be call on initial render.
   */
  const handleOnLayout = (0, _react.useCallback)(event => {
    if (onLayout) {
      onLayout(event);
    }
    if (!isInitialContentHeightCaptured.current) {
      isInitialContentHeightCaptured.current = true;
      if (!isWebkit()) {
        return;
      }

      /**
       * early exit if the content height been calculated.
       */
      if (animatedLayoutState.get().contentHeight !== _constants.INITIAL_LAYOUT_VALUE) {
        return;
      }
      // @ts-expect-error
      window.requestAnimationFrame(() => {
        // @ts-expect-error
        setContentSize(event.nativeEvent.target.clientHeight);
      });
    }
  }, [onLayout, setContentSize, animatedLayoutState]);
  //#endregion
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_BottomSheetDraggableScrollable.BottomSheetDraggableScrollable, {
    scrollableGesture: nativeGesture,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(ScrollableComponent, {
      ref: ref,
      ...rest,
      onLayout: handleOnLayout,
      renderScrollComponent: renderScrollComponent
    })
  });
});
//# sourceMappingURL=ScrollableContainer.web.js.map