"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAnimatedLayout = useAnimatedLayout;
var _react = require("react");
var _reactNative = require("react-native");
var _reactNativeReanimated = require("react-native-reanimated");
var _constants = require("../constants");
const INITIAL_STATE = {
  window: _reactNative.Dimensions.get('window'),
  rawContainerHeight: _constants.INITIAL_LAYOUT_VALUE,
  containerHeight: _constants.INITIAL_LAYOUT_VALUE,
  containerOffset: _constants.INITIAL_CONTAINER_LAYOUT.offset,
  handleHeight: _constants.INITIAL_LAYOUT_VALUE,
  footerHeight: _constants.INITIAL_LAYOUT_VALUE,
  contentHeight: _constants.INITIAL_LAYOUT_VALUE
};

/**
 * A custom hook that manages and animates the layout state of a container,
 * typically used in bottom sheet components. It calculates the effective
 * container height by considering top and bottom insets, and updates the
 * animated state in response to layout changes. The hook supports both modal
 * and non-modal modes, and ensures the container's animated layout state
 * remains in sync with the actual layout measurements.
 *
 * @param containerLayoutState - A shared value representing the current container layout state.
 * @param topInset - The top inset value to be subtracted from the container height.
 * @param bottomInset - The bottom inset value to be subtracted from the container height.
 * @param modal - Optional flag indicating if the layout is in modal mode.
 * @param shouldOverrideHandleHeight - Optional flag to override the handle height in the layout state, only when handle is set to null.
 * @returns An object containing the animated layout state.
 */
function useAnimatedLayout(containerLayoutState, topInset, bottomInset, modal, shouldOverrideHandleHeight) {
  //#region  variables
  const verticalInset = (0, _react.useMemo)(() => topInset + bottomInset, [topInset, bottomInset]);
  const initialState = (0, _react.useMemo)(() => {
    const _state = {
      ...INITIAL_STATE
    };
    if (containerLayoutState) {
      const containerLayout = containerLayoutState.get();
      _state.containerHeight = modal ? containerLayout.height - verticalInset : containerLayout.height;
      _state.containerOffset = containerLayout.offset;
    }
    if (shouldOverrideHandleHeight) {
      _state.handleHeight = 0;
    }
    return _state;
  }, [containerLayoutState, modal, shouldOverrideHandleHeight, verticalInset]);
  //#endregion

  //#region state
  const [state] = (0, _react.useState)(() => (0, _reactNativeReanimated.makeMutable)(initialState));
  //#endregion

  //#region effects
  (0, _reactNativeReanimated.useAnimatedReaction)(() => state.value.rawContainerHeight, (result, previous) => {
    if (result === previous) {
      return;
    }
    if (result === _constants.INITIAL_LAYOUT_VALUE) {
      return;
    }
    state.modify(_state => {
      'worklet';

      _state.containerHeight = modal ? result - verticalInset : result;
      return _state;
    });
  }, [state, verticalInset, modal]);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => containerLayoutState?.get().height, (result, previous) => {
    if (!result || result === previous) {
      return;
    }
    if (result === _constants.INITIAL_LAYOUT_VALUE) {
      return;
    }
    state.modify(_state => {
      'worklet';

      _state.containerHeight = modal ? result - verticalInset : result;
      return _state;
    });
  }, [state, verticalInset, modal]);
  (0, _react.useEffect)(() => {
    _reactNative.Dimensions.addEventListener('change', ({
      window
    }) => {
      state.modify(_state => {
        'worklet';

        _state.window = window;
        return _state;
      });
    });
  }, [state]);
  //#endregion

  return state;
}
//# sourceMappingURL=useAnimatedLayout.js.map