"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useScrollable = void 0;
var _react = require("react");
var _reactNativeReanimated = require("react-native-reanimated");
var _constants = require("../constants");
var _utilities = require("../utilities");
const useScrollable = (enableContentPanningGesture, animatedSheetState, animatedKeyboardState, animatedAnimationState) => {
  //#region refs
  const scrollableRef = (0, _react.useRef)(null);
  const previousScrollableRef = (0, _react.useRef)(null);
  //#endregion

  //#region variables
  const state = (0, _reactNativeReanimated.useSharedValue)({
    type: _constants.SCROLLABLE_TYPE.UNDETERMINED,
    contentOffsetY: 0,
    refreshable: false
  });
  const status = (0, _reactNativeReanimated.useDerivedValue)(() => {
    /**
     * if user had disabled content panning gesture, then we unlock
     * the scrollable state.
     */
    if (!enableContentPanningGesture) {
      return _constants.SCROLLABLE_STATUS.UNLOCKED;
    }

    /**
     * if sheet state is fill parent, then unlock scrolling
     */
    if (animatedSheetState.value === _constants.SHEET_STATE.FILL_PARENT) {
      return _constants.SCROLLABLE_STATUS.UNLOCKED;
    }

    /**
     * if sheet state is extended, then unlock scrolling
     */
    if (animatedSheetState.value === _constants.SHEET_STATE.EXTENDED) {
      return _constants.SCROLLABLE_STATUS.UNLOCKED;
    }

    /**
     * if keyboard is shown and sheet is animating
     * then we do not lock the scrolling to not lose
     * current scrollable scroll position.
     */
    if (animatedKeyboardState.get().status === _constants.KEYBOARD_STATUS.SHOWN && animatedAnimationState.get().status === _constants.ANIMATION_STATUS.RUNNING) {
      return _constants.SCROLLABLE_STATUS.UNLOCKED;
    }
    return _constants.SCROLLABLE_STATUS.LOCKED;
  }, [enableContentPanningGesture, animatedSheetState, animatedKeyboardState, animatedAnimationState, state]);
  //#endregion

  //#region callbacks
  const setScrollableRef = (0, _react.useCallback)(ref => {
    // get current node handle id
    const currentRefId = scrollableRef.current?.id ?? null;
    if (currentRefId !== ref.id) {
      if (scrollableRef.current) {
        // @ts-expect-error
        previousScrollableRef.current = scrollableRef.current;
      }
      // @ts-expect-error
      scrollableRef.current = ref;
    }
  }, []);
  const removeScrollableRef = (0, _react.useCallback)(ref => {
    // find node handle id
    let id;
    try {
      id = (0, _utilities.findNodeHandle)(ref.current);
    } catch {
      return;
    }

    // get current node handle id
    const currentRefId = scrollableRef.current?.id ?? null;

    /**
     * @DEV
     * when the incoming node is actually the current node, we reset
     * the current scrollable ref to the previous one.
     */
    if (id === currentRefId) {
      // @ts-expect-error
      scrollableRef.current = previousScrollableRef.current;
    }
  }, []);
  //#endregion

  return {
    state,
    status,
    setScrollableRef,
    removeScrollableRef
  };
};
exports.useScrollable = useScrollable;
//# sourceMappingURL=useScrollable.js.map