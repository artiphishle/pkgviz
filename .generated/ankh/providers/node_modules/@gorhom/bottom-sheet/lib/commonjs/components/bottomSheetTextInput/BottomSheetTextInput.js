"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _hooks = require("../../hooks");
var _utilities = require("../../utilities");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const BottomSheetTextInputComponent = /*#__PURE__*/(0, _react.forwardRef)(({
  onFocus,
  onBlur,
  ...rest
}, providedRef) => {
  //#region refs
  const ref = (0, _react.useRef)(null);
  //#endregion

  //#region hooks
  const {
    animatedKeyboardState,
    textInputNodesRef
  } = (0, _hooks.useBottomSheetInternal)();
  //#endregion

  //#region callbacks
  const handleOnFocus = (0, _react.useCallback)(args => {
    animatedKeyboardState.set(state => ({
      ...state,
      target: args.nativeEvent.target
    }));
    if (onFocus) {
      onFocus(args);
    }
  }, [onFocus, animatedKeyboardState]);
  const handleOnBlur = (0, _react.useCallback)(args => {
    const keyboardState = animatedKeyboardState.get();
    const currentFocusedInput = (0, _utilities.findNodeHandle)(_reactNative.TextInput.State.currentlyFocusedInput());

    /**
     * we need to make sure that we only remove the target
     * if the target belong to the current component and
     * if the currently focused input is not in the targets set.
     */
    const shouldRemoveCurrentTarget = keyboardState.target === args.nativeEvent.target;
    const shouldIgnoreBlurEvent = currentFocusedInput && textInputNodesRef.current.has(currentFocusedInput);
    if (shouldRemoveCurrentTarget && !shouldIgnoreBlurEvent) {
      animatedKeyboardState.set(state => ({
        ...state,
        target: undefined
      }));
    }
    if (onBlur) {
      onBlur(args);
    }
  }, [onBlur, animatedKeyboardState, textInputNodesRef]);
  //#endregion

  //#region effects
  (0, _react.useEffect)(() => {
    const componentNode = (0, _utilities.findNodeHandle)(ref.current);
    if (!componentNode) {
      return;
    }
    if (!textInputNodesRef.current.has(componentNode)) {
      textInputNodesRef.current.add(componentNode);
    }
    return () => {
      const componentNode = (0, _utilities.findNodeHandle)(ref.current);
      if (!componentNode) {
        return;
      }
      const keyboardState = animatedKeyboardState.get();
      /**
       * remove the keyboard state target if it belong
       * to the current component.
       */
      if (keyboardState.target === componentNode) {
        animatedKeyboardState.set(state => ({
          ...state,
          target: undefined
        }));
      }
      if (textInputNodesRef.current.has(componentNode)) {
        textInputNodesRef.current.delete(componentNode);
      }
    };
  }, [textInputNodesRef, animatedKeyboardState]);
  (0, _react.useImperativeHandle)(providedRef, () => ref.current ?? undefined, []);
  //#endregion

  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeGestureHandler.TextInput, {
    ref: ref,
    onFocus: handleOnFocus,
    onBlur: handleOnBlur,
    ...rest
  });
});
const BottomSheetTextInput = /*#__PURE__*/(0, _react.memo)(BottomSheetTextInputComponent);
BottomSheetTextInput.displayName = 'BottomSheetTextInput';
var _default = exports.default = BottomSheetTextInput;
//# sourceMappingURL=BottomSheetTextInput.js.map