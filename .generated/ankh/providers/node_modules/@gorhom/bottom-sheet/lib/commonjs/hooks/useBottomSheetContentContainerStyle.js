"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useBottomSheetContentContainerStyle = useBottomSheetContentContainerStyle;
var _react = require("react");
var _reactNative = require("react-native");
var _reactNativeReanimated = require("react-native-reanimated");
var _useBottomSheetInternal = require("./useBottomSheetInternal");
function useBottomSheetContentContainerStyle(enableFooterMarginAdjustment, _style) {
  const [footerHeight, setFooterHeight] = (0, _react.useState)(0);
  //#region hooks
  const {
    animatedLayoutState
  } = (0, _useBottomSheetInternal.useBottomSheetInternal)();
  //#endregion

  //#region styles
  const flattenStyle = (0, _react.useMemo)(() => {
    return !_style ? {} : Array.isArray(_style) ?
    // @ts-ignore
    _reactNative.StyleSheet.compose(..._style) : _style;
  }, [_style]);
  const style = (0, _react.useMemo)(() => {
    if (!enableFooterMarginAdjustment) {
      return flattenStyle;
    }
    let currentBottomPadding = 0;
    if (flattenStyle && typeof flattenStyle === 'object') {
      const {
        paddingBottom,
        padding,
        paddingVertical
      } = flattenStyle;
      if (paddingBottom !== undefined && typeof paddingBottom === 'number') {
        currentBottomPadding = paddingBottom;
      } else if (paddingVertical !== undefined && typeof paddingVertical === 'number') {
        currentBottomPadding = paddingVertical;
      } else if (padding !== undefined && typeof padding === 'number') {
        currentBottomPadding = padding;
      }
    }
    return [flattenStyle, {
      paddingBottom: currentBottomPadding + footerHeight,
      overflow: 'visible'
    }];
  }, [footerHeight, enableFooterMarginAdjustment, flattenStyle]);
  //#endregion

  //#region effects
  (0, _reactNativeReanimated.useAnimatedReaction)(() => animatedLayoutState.get().footerHeight, (result, previousFooterHeight) => {
    if (!enableFooterMarginAdjustment) {
      return;
    }
    (0, _reactNativeReanimated.runOnJS)(setFooterHeight)(result);
    if (_reactNative.Platform.OS === 'web') {
      /**
       * a reaction that will append the footer height to the content
       * height if margin adjustment is true.
       *
       * This is needed due to the web layout the footer after the content.
       */
      if (result && !previousFooterHeight) {
        animatedLayoutState.modify(state => {
          'worklet';

          state.contentHeight = state.contentHeight + result;
          return state;
        });
      }
    }
  }, [animatedLayoutState, enableFooterMarginAdjustment]);
  //#endregion
  return style;
}
//# sourceMappingURL=useBottomSheetContentContainerStyle.js.map