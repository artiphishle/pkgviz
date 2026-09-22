"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = _interopRequireDefault(require("react-native-reanimated"));
var _hooks = require("../../hooks");
var _utilities = require("../../utilities");
var _constants = require("../bottomSheet/constants");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function BottomSheetHandleContainerComponent({
  animatedIndex,
  animatedPosition,
  simultaneousHandlers: _internalSimultaneousHandlers,
  enableHandlePanningGesture = _constants.DEFAULT_ENABLE_HANDLE_PANNING_GESTURE,
  handleComponent: HandleComponent,
  handleStyle: _providedHandleStyle,
  handleIndicatorStyle: _providedIndicatorStyle
}) {
  //#region refs
  const ref = (0, _react.useRef)(null);
  //#endregion

  //#region hooks
  const {
    animatedLayoutState,
    activeOffsetX,
    activeOffsetY,
    failOffsetX,
    failOffsetY,
    waitFor,
    simultaneousHandlers: _providedSimultaneousHandlers
  } = (0, _hooks.useBottomSheetInternal)();
  const {
    handlePanGestureHandler
  } = (0, _hooks.useBottomSheetGestureHandlers)();
  //#endregion

  //#region variables
  const simultaneousHandlers = (0, _react.useMemo)(() => {
    const refs = [];
    if (_internalSimultaneousHandlers) {
      refs.push(_internalSimultaneousHandlers);
    }
    if (_providedSimultaneousHandlers) {
      if (Array.isArray(_providedSimultaneousHandlers)) {
        refs.push(..._providedSimultaneousHandlers);
      } else {
        refs.push(_providedSimultaneousHandlers);
      }
    }
    return refs;
  }, [_providedSimultaneousHandlers, _internalSimultaneousHandlers]);
  const panGesture = (0, _react.useMemo)(() => {
    let gesture = _reactNativeGestureHandler.Gesture.Pan().enabled(enableHandlePanningGesture).shouldCancelWhenOutside(false).runOnJS(false).onStart(handlePanGestureHandler.handleOnStart).onChange(handlePanGestureHandler.handleOnChange).onEnd(handlePanGestureHandler.handleOnEnd).onFinalize(handlePanGestureHandler.handleOnFinalize);
    if (waitFor) {
      gesture = gesture.requireExternalGestureToFail(waitFor);
    }
    if (simultaneousHandlers) {
      gesture = gesture.simultaneousWithExternalGesture(simultaneousHandlers);
    }
    if (activeOffsetX) {
      gesture = gesture.activeOffsetX(activeOffsetX);
    }
    if (activeOffsetY) {
      gesture = gesture.activeOffsetY(activeOffsetY);
    }
    if (failOffsetX) {
      gesture = gesture.failOffsetX(failOffsetX);
    }
    if (failOffsetY) {
      gesture = gesture.failOffsetY(failOffsetY);
    }
    return gesture;
  }, [activeOffsetX, activeOffsetY, enableHandlePanningGesture, failOffsetX, failOffsetY, simultaneousHandlers, waitFor, handlePanGestureHandler.handleOnChange, handlePanGestureHandler.handleOnEnd, handlePanGestureHandler.handleOnFinalize, handlePanGestureHandler.handleOnStart]);
  //#endregion

  //#region callbacks
  const handleContainerLayout = (0, _react.useCallback)(function handleContainerLayout({
    nativeEvent: {
      layout: {
        height
      }
    }
  }) {
    animatedLayoutState.modify(state => {
      'worklet';

      state.handleHeight = height;
      return state;
    });
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheetHandleContainer',
        method: 'handleContainerLayout',
        category: 'layout',
        params: {
          height
        }
      });
    }
  }, [animatedLayoutState]);
  const handleBoundingClientRect = (0, _react.useCallback)(({
    height
  }) => {
    animatedLayoutState.modify(state => {
      'worklet';

      state.handleHeight = height;
      return state;
    });
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheetHandleContainer',
        method: 'handleBoundingClientRect',
        category: 'layout',
        params: {
          height
        }
      });
    }
  }, [animatedLayoutState]);
  //#endregion

  //#region effects
  (0, _hooks.useBoundingClientRect)(ref, handleBoundingClientRect);
  //#endregion

  //#region renders
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeGestureHandler.GestureDetector, {
    gesture: panGesture,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
      ref: ref,
      onLayout: handleContainerLayout,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(HandleComponent, {
        animatedIndex: animatedIndex,
        animatedPosition: animatedPosition,
        style: _providedHandleStyle,
        indicatorStyle: _providedIndicatorStyle
      })
    }, "BottomSheetHandleContainer")
  });
  //#endregion
}
const BottomSheetHandleContainer = /*#__PURE__*/(0, _react.memo)(BottomSheetHandleContainerComponent);
BottomSheetHandleContainer.displayName = 'BottomSheetHandleContainer';
var _default = exports.default = BottomSheetHandleContainer;
//# sourceMappingURL=BottomSheetHandleContainer.js.map