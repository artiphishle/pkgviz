"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useScrollableSetter = void 0;
var _react = require("react");
var _utilities = require("../utilities");
var _useBottomSheetInternal = require("./useBottomSheetInternal");
const useScrollableSetter = (ref, type, contentOffsetY, refreshable, useFocusHook = _react.useEffect) => {
  // hooks
  const {
    animatedScrollableState,
    setScrollableRef,
    removeScrollableRef
  } = (0, _useBottomSheetInternal.useBottomSheetInternal)();

  // callbacks
  const handleSettingScrollable = (0, _react.useCallback)(() => {
    // set current content offset
    animatedScrollableState.set(state => ({
      ...state,
      contentOffsetY: contentOffsetY.value,
      type,
      refreshable
    }));

    // set current scrollable ref
    const id = (0, _utilities.findNodeHandle)(ref.current);
    if (id) {
      setScrollableRef({
        id: id,
        node: ref
      });
    } else {
      console.warn(`Couldn't find the scrollable node handle id!`);
    }
    return () => {
      removeScrollableRef(ref);
    };
  }, [ref, type, refreshable, contentOffsetY, animatedScrollableState, setScrollableRef, removeScrollableRef]);

  // effects
  useFocusHook(handleSettingScrollable);
};
exports.useScrollableSetter = useScrollableSetter;
//# sourceMappingURL=useScrollableSetter.js.map