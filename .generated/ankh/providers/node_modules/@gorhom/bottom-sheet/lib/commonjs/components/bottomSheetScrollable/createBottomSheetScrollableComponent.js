"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBottomSheetScrollableComponent = createBottomSheetScrollableComponent;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = require("react-native-reanimated");
var _constants = require("../../constants");
var _gesture = require("../../contexts/gesture");
var _hooks = require("../../hooks");
var _ScrollableContainer = require("./ScrollableContainer");
var _useBottomSheetContentSizeSetter = require("./useBottomSheetContentSizeSetter");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function createBottomSheetScrollableComponent(type,
// biome-ignore lint: to be addressed!
ScrollableComponent) {
  return /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
    //#region props
    const {
      // hooks
      focusHook,
      scrollEventsHandlersHook,
      // props
      enableFooterMarginAdjustment = false,
      overScrollMode = 'never',
      keyboardDismissMode = 'interactive',
      showsVerticalScrollIndicator = true,
      contentContainerStyle: _providedContentContainerStyle,
      refreshing,
      onRefresh,
      progressViewOffset,
      refreshControl,
      // events
      onScroll,
      onScrollBeginDrag,
      onScrollEndDrag,
      onContentSizeChange,
      ...rest
      // biome-ignore lint: to be addressed!
    } = props;
    //#endregion

    //#region hooks
    const draggableGesture = (0, _react.useContext)(_gesture.BottomSheetDraggableContext);
    const {
      scrollableRef,
      scrollableContentOffsetY,
      scrollHandler
    } = (0, _hooks.useScrollHandler)(scrollEventsHandlersHook, onScroll, onScrollBeginDrag, onScrollEndDrag);
    const {
      animatedScrollableStatus: animatedScrollableState,
      enableContentPanningGesture
    } = (0, _hooks.useBottomSheetInternal)();
    const {
      setContentSize
    } = (0, _useBottomSheetContentSizeSetter.useBottomSheetContentSizeSetter)();
    //#endregion

    if (!draggableGesture && enableContentPanningGesture) {
      throw "'Scrollable' cannot be used out of the BottomSheet!";
    }

    //#region variables
    const scrollableAnimatedProps = (0, _reactNativeReanimated.useAnimatedProps)(() => ({
      decelerationRate: _constants.SCROLLABLE_DECELERATION_RATE_MAPPER[animatedScrollableState.value],
      showsVerticalScrollIndicator: showsVerticalScrollIndicator ? animatedScrollableState.value === _constants.SCROLLABLE_STATUS.UNLOCKED : showsVerticalScrollIndicator
    }), [animatedScrollableState, showsVerticalScrollIndicator]);
    const scrollableGesture = (0, _react.useMemo)(() => draggableGesture ? _reactNativeGestureHandler.Gesture.Native()
    // @ts-expect-error
    .simultaneousWithExternalGesture(draggableGesture).shouldCancelWhenOutside(false) : undefined, [draggableGesture]);
    //#endregion

    //#region callbacks
    const handleContentSizeChange = (0, _hooks.useStableCallback)((contentWidth, contentHeight) => {
      setContentSize(contentHeight);
      if (onContentSizeChange) {
        onContentSizeChange(contentWidth, contentHeight);
      }
    });
    //#endregion

    //#region styles
    const contentContainerStyle = (0, _hooks.useBottomSheetContentContainerStyle)(enableFooterMarginAdjustment, _providedContentContainerStyle);
    //#endregion

    //#region effects
    // @ts-expect-error
    (0, _react.useImperativeHandle)(ref, () => scrollableRef.current);
    (0, _hooks.useScrollableSetter)(scrollableRef, type, scrollableContentOffsetY, onRefresh !== undefined, focusHook);
    //#endregion

    //#region render
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ScrollableContainer.ScrollableContainer, {
      ref: scrollableRef,
      nativeGesture: scrollableGesture,
      animatedProps: scrollableAnimatedProps,
      overScrollMode: overScrollMode,
      keyboardDismissMode: keyboardDismissMode,
      refreshing: refreshing,
      scrollEventThrottle: 16,
      progressViewOffset: progressViewOffset,
      contentContainerStyle: contentContainerStyle,
      onRefresh: onRefresh,
      onScroll: scrollHandler,
      onContentSizeChange: handleContentSizeChange,
      setContentSize: setContentSize,
      ScrollableComponent: ScrollableComponent,
      refreshControl: refreshControl,
      ...rest
    });
    //#endregion
  });
}
//# sourceMappingURL=createBottomSheetScrollableComponent.js.map