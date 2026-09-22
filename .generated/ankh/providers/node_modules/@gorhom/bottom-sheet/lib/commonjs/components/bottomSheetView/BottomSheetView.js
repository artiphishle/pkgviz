"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _constants = require("../../constants");
var _hooks = require("../../hooks");
var _utilities = require("../../utilities");
var _styles = require("./styles");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function BottomSheetViewComponent({
  focusHook: useFocusHook = _react.useEffect,
  enableFooterMarginAdjustment = false,
  onLayout,
  style: _providedStyle,
  children,
  ...rest
}) {
  //#region hooks
  const {
    animatedScrollableState,
    enableDynamicSizing,
    animatedLayoutState
  } = (0, _hooks.useBottomSheetInternal)();
  //#endregion

  //#region styles
  const containerStyle = (0, _hooks.useBottomSheetContentContainerStyle)(enableFooterMarginAdjustment, _providedStyle);
  const style = (0, _react.useMemo)(() => [containerStyle, _styles.styles.container], [containerStyle]);
  //#endregion

  //#region callbacks
  const handleSettingScrollable = (0, _react.useCallback)(() => {
    animatedScrollableState.set(state => ({
      ...state,
      contentOffsetY: 0,
      type: _constants.SCROLLABLE_TYPE.VIEW
    }));
  }, [animatedScrollableState]);
  const handleLayout = (0, _react.useCallback)(event => {
    if (enableDynamicSizing) {
      const {
        nativeEvent: {
          layout: {
            height
          }
        }
      } = event;
      animatedLayoutState.modify(state => {
        'worklet';

        state.contentHeight = height;
        return state;
      });
    }
    if (onLayout) {
      onLayout(event);
    }
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheetView',
        method: 'handleLayout',
        category: 'layout',
        params: {
          height: event.nativeEvent.layout.height
        }
      });
    }
  }, [onLayout, animatedLayoutState, enableDynamicSizing]);
  //#endregion

  //#region effects
  useFocusHook(handleSettingScrollable);
  //#endregion

  //render
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    ...rest,
    onLayout: handleLayout,
    style: style,
    children: children
  });
}
const BottomSheetView = /*#__PURE__*/(0, _react.memo)(BottomSheetViewComponent);
BottomSheetView.displayName = 'BottomSheetView';
var _default = exports.default = BottomSheetView;
//# sourceMappingURL=BottomSheetView.js.map