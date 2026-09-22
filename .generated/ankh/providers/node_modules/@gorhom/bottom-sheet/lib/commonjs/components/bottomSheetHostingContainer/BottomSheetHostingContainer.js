"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BottomSheetHostingContainer = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _utilities = require("../../utilities");
var _styles = require("./styles");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function BottomSheetHostingContainerComponent({
  containerLayoutState,
  layoutState,
  topInset = 0,
  bottomInset = 0,
  shouldCalculateHeight = true,
  detached,
  style,
  children
}) {
  //#region refs
  const containerRef = (0, _react.useRef)(null);
  //#endregion

  //#region styles
  const containerStyle = (0, _react.useMemo)(() => [style, _reactNative.StyleSheet.absoluteFill, _styles.styles.container, {
    top: topInset,
    bottom: bottomInset,
    overflow: detached ? 'visible' : 'hidden'
  }], [style, detached, topInset, bottomInset]);
  //#endregion

  //#region callbacks
  const handleLayoutEvent = (0, _react.useCallback)(function handleLayoutEvent({
    nativeEvent: {
      layout: {
        height
      }
    }
  }) {
    if (containerLayoutState) {
      containerLayoutState.modify(state => {
        'worklet';

        state.height = height;
        return state;
      });
    }
    if (layoutState) {
      layoutState.modify(state => {
        'worklet';

        state.rawContainerHeight = height;
        return state;
      });
    }
    const WINDOW_HEIGHT = _reactNative.Dimensions.get('window').height;
    containerRef.current?.measure((_x, _y, _width, _height, _pageX, pageY) => {
      const offset = {
        bottom: Math.max(0, WINDOW_HEIGHT - ((pageY ?? 0) + height + (_reactNative.StatusBar.currentHeight ?? 0))),
        top: pageY ?? 0,
        left: 0,
        right: 0
      };
      if (containerLayoutState) {
        containerLayoutState.modify(state => {
          'worklet';

          state.offset = offset;
          return state;
        });
      }
      if (layoutState) {
        layoutState.modify(state => {
          'worklet';

          state.containerOffset = offset;
          return state;
        });
      }
    });
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheetHostingContainer',
        method: 'handleLayoutEvent',
        category: 'layout',
        params: {
          height
        }
      });
    }
  }, [layoutState, containerLayoutState]);
  //#endregion

  //#region render
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    ref: containerRef,
    pointerEvents: "box-none",
    onLayout: shouldCalculateHeight ? handleLayoutEvent : undefined,
    style: containerStyle,
    collapsable: true,
    children: children
  });
  //#endregion
}
const BottomSheetHostingContainer = exports.BottomSheetHostingContainer = /*#__PURE__*/(0, _react.memo)(BottomSheetHostingContainerComponent);
BottomSheetHostingContainer.displayName = 'BottomSheetHostingContainer';
//# sourceMappingURL=BottomSheetHostingContainer.js.map