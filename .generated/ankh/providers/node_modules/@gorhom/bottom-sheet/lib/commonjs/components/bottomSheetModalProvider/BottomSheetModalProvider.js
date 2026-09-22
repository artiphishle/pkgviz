"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _portal = require("@gorhom/portal");
var _react = _interopRequireWildcard(require("react"));
var _reactNativeReanimated = require("react-native-reanimated");
var _constants = require("../../constants");
var _contexts = require("../../contexts");
var _id = require("../../utilities/id");
var _bottomSheetHostingContainer = require("../bottomSheetHostingContainer");
var _constants2 = require("../bottomSheetModal/constants");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const BottomSheetModalProviderWrapper = ({
  children
}) => {
  //#region layout variables
  const animatedContainerLayoutState = (0, _reactNativeReanimated.useSharedValue)(_constants.INITIAL_CONTAINER_LAYOUT);
  //#endregion

  //#region variables
  const hostName = (0, _react.useMemo)(() => `bottom-sheet-portal-${(0, _id.id)()}`, []);
  const sheetsQueueRef = (0, _react.useRef)([]);
  //#endregion

  //#region private methods
  const handleMountSheet = (0, _react.useCallback)((key, ref, stackBehavior) => {
    const _sheetsQueue = sheetsQueueRef.current.slice();
    const sheetIndex = _sheetsQueue.findIndex(item => item.key === key);
    const sheetOnTop = sheetIndex === _sheetsQueue.length - 1;

    /**
     * Exit the method, if sheet is already presented
     * and at the top.
     */
    if (sheetIndex !== -1 && sheetOnTop) {
      return;
    }

    /**
     * Minimize the current sheet if:
     * - it exists.
     * - it is not unmounting.
     * - stack behavior is 'replace'.
     */

    /**
     * Handle switch or replace stack behaviors, if:
     * - a modal is currently presented.
     * - it is not unmounting
     */
    const currentMountedSheet = _sheetsQueue[_sheetsQueue.length - 1];
    const currentMountedSheetStatus = currentMountedSheet?.ref.current?.status.current;
    const currentMountedSheetWillUnmount = currentMountedSheetStatus !== undefined && currentMountedSheetStatus === _constants2.MODAL_STATUS.DISMISSING;
    if (currentMountedSheet && !currentMountedSheetWillUnmount) {
      if (stackBehavior === _constants.MODAL_STACK_BEHAVIOR.replace) {
        currentMountedSheet.ref?.current?.dismiss();
      } else if (stackBehavior === _constants.MODAL_STACK_BEHAVIOR.switch) {
        currentMountedSheet.ref?.current?.minimize();
      }
    }

    /**
     * Restore and remove incoming sheet from the queue, if it was registered.
     */
    if (sheetIndex !== -1) {
      _sheetsQueue.splice(sheetIndex, 1);
      ref?.current?.restore();
    }
    _sheetsQueue.push({
      key,
      ref
    });
    sheetsQueueRef.current = _sheetsQueue;
  }, []);
  const handleUnmountSheet = (0, _react.useCallback)(key => {
    const _sheetsQueue = sheetsQueueRef.current.slice();
    const sheetIndex = _sheetsQueue.findIndex(item => item.key === key);
    const sheetOnTop = sheetIndex === _sheetsQueue.length - 1;

    /**
     * Here we remove the unmounted sheet and update
     * the sheets queue.
     */
    if (sheetIndex !== -1) {
      _sheetsQueue.splice(sheetIndex, 1);
      sheetsQueueRef.current = _sheetsQueue;
    }

    /**
     * Here we try to restore previous sheet position if unmounted
     * sheet was on top. This is needed when user dismiss
     * the modal by panning down.
     */
    const hasMinimizedSheet = sheetsQueueRef.current.length > 0;
    const minimizedSheet = sheetsQueueRef.current[sheetsQueueRef.current.length - 1];
    const minimizedSheetStatus = minimizedSheet?.ref.current?.status.current;
    const minimizedSheetWillUnmount = minimizedSheetStatus !== undefined && minimizedSheetStatus === _constants2.MODAL_STATUS.DISMISSING;
    if (sheetOnTop && hasMinimizedSheet && minimizedSheet && !minimizedSheetWillUnmount) {
      sheetsQueueRef.current[sheetsQueueRef.current.length - 1].ref?.current?.restore();
    }
  }, []);
  const handleWillUnmountSheet = (0, _react.useCallback)(key => {
    const _sheetsQueue = sheetsQueueRef.current.slice();
    const sheetIndex = _sheetsQueue.findIndex(item => item.key === key);
    const sheetOnTop = sheetIndex === _sheetsQueue.length - 1;

    /**
     * Here we try to restore previous sheet position,
     * This is needed when user dismiss the modal by fire the dismiss action.
     */
    const hasMinimizedSheet = _sheetsQueue.length > 1;
    if (sheetOnTop && hasMinimizedSheet) {
      _sheetsQueue[_sheetsQueue.length - 2].ref?.current?.restore();
    }
    sheetsQueueRef.current = _sheetsQueue;
  }, []);
  //#endregion

  //#region public methods
  const handleDismiss = (0, _react.useCallback)(key => {
    const sheetToBeDismissed = key ? sheetsQueueRef.current.find(item => item.key === key) : sheetsQueueRef.current[sheetsQueueRef.current.length - 1];
    if (sheetToBeDismissed) {
      sheetToBeDismissed.ref?.current?.dismiss();
      return true;
    }
    return false;
  }, []);
  const handleDismissAll = (0, _react.useCallback)(() => {
    sheetsQueueRef.current.forEach(item => {
      item.ref?.current?.dismiss();
    });
  }, []);
  //#endregion

  //#region context variables
  const externalContextVariables = (0, _react.useMemo)(() => ({
    dismiss: handleDismiss,
    dismissAll: handleDismissAll
  }), [handleDismiss, handleDismissAll]);
  const internalContextVariables = (0, _react.useMemo)(() => ({
    hostName,
    containerLayoutState: animatedContainerLayoutState,
    mountSheet: handleMountSheet,
    unmountSheet: handleUnmountSheet,
    willUnmountSheet: handleWillUnmountSheet
  }), [hostName, animatedContainerLayoutState, handleMountSheet, handleUnmountSheet, handleWillUnmountSheet]);
  //#endregion

  //#region renders
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_contexts.BottomSheetModalProvider, {
    value: externalContextVariables,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_contexts.BottomSheetModalInternalProvider, {
      value: internalContextVariables,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_bottomSheetHostingContainer.BottomSheetHostingContainer, {
        containerLayoutState: animatedContainerLayoutState
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_portal.PortalProvider, {
        rootHostName: hostName,
        children: children
      })]
    })
  });
  //#endregion
};
var _default = exports.default = BottomSheetModalProviderWrapper;
//# sourceMappingURL=BottomSheetModalProvider.js.map