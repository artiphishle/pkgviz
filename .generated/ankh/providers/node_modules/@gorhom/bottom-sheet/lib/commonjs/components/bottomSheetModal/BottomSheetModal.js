"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _portal = require("@gorhom/portal");
var _react = _interopRequireWildcard(require("react"));
var _hooks = require("../../hooks");
var _utilities = require("../../utilities");
var _id = require("../../utilities/id");
var _bottomSheet = _interopRequireDefault(require("../bottomSheet"));
var _constants = require("./constants");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/** biome-ignore-all lint/correctness/useHookAtTopLevel: random error needs extra time to debug */

const INITIAL_STATE = {
  mount: false,
  data: undefined
};
function BottomSheetModalComponent(props, ref) {
  const {
    // modal props
    name,
    stackBehavior = _constants.DEFAULT_STACK_BEHAVIOR,
    enableDismissOnClose = _constants.DEFAULT_ENABLE_DISMISS_ON_CLOSE,
    onDismiss: _providedOnDismiss,
    onAnimate: _providedOnAnimate,
    // bottom sheet props
    index = 0,
    snapPoints,
    enablePanDownToClose = true,
    animateOnMount = true,
    containerComponent: ContainerComponent = _react.default.Fragment,
    // callbacks
    onChange: _providedOnChange,
    // components
    children: Content,
    ...bottomSheetProps
  } = props;

  //#region state
  const [{
    mount,
    data
  }, setState] = (0, _react.useState)(INITIAL_STATE);
  const mountRef = (0, _react.useRef)(mount);
  mountRef.current = mount;
  //#endregion

  //#region hooks
  const {
    hostName,
    containerLayoutState,
    mountSheet,
    unmountSheet,
    willUnmountSheet
  } = (0, _hooks.useBottomSheetModalInternal)();
  const {
    removePortal: unmountPortal
  } = (0, _portal.usePortal)(hostName);
  //#endregion

  //#region refs
  const bottomSheetRef = (0, _react.useRef)(null);
  const statusRef = (0, _react.useRef)(_constants.MODAL_STATUS.INITIAL);
  const currentIndexRef = (0, _react.useRef)(!animateOnMount ? index : -1);
  const nextIndexRef = (0, _react.useRef)(null);
  const restoreIndexRef = (0, _react.useRef)(-1);
  //#endregion

  //#region variables
  const key = (0, _react.useMemo)(() => name || `bottom-sheet-modal-${(0, _id.id)()}`, [name]);
  //#endregion

  //#region private methods
  const resetVariables = (0, _react.useCallback)(function resetVariables() {
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheetModal',
        method: resetVariables.name
      });
    }
    currentIndexRef.current = -1;
    restoreIndexRef.current = -1;
    statusRef.current = _constants.MODAL_STATUS.INITIAL;
  }, []);
  const unmount = (0, _react.useCallback)(function unmount() {
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheetModal',
        method: unmount.name
      });
    }
    const hadReactMount = mountRef.current;

    // reset variables
    resetVariables();

    // unmount sheet and portal
    unmountSheet(key);
    unmountPortal(key);

    // unmount the node, if sheet is still mounted in React state
    if (hadReactMount) {
      setState(INITIAL_STATE);
    }

    // fire `onDismiss` callback
    if (_providedOnDismiss) {
      _providedOnDismiss();
    }
  }, [key, resetVariables, unmountSheet, unmountPortal, _providedOnDismiss]);
  //#endregion

  //#region bottom sheet methods
  const handleSnapToIndex = (0, _react.useCallback)((...args) => {
    if (statusRef.current === _constants.MODAL_STATUS.MINIMIZED || statusRef.current === _constants.MODAL_STATUS.MINIMIZING) {
      return;
    }
    bottomSheetRef.current?.snapToIndex(...args);
  }, []);
  const handleSnapToPosition = (0, _react.useCallback)((...args) => {
    if ([_constants.MODAL_STATUS.MINIMIZED, _constants.MODAL_STATUS.MINIMIZING, _constants.MODAL_STATUS.DISMISSED, _constants.MODAL_STATUS.DISMISSING].includes(statusRef.current)) {
      return;
    }
    bottomSheetRef.current?.snapToPosition(...args);
  }, []);
  const handleExpand = (0, _react.useCallback)((...args) => {
    if ([_constants.MODAL_STATUS.MINIMIZED, _constants.MODAL_STATUS.MINIMIZING, _constants.MODAL_STATUS.DISMISSED, _constants.MODAL_STATUS.DISMISSING].includes(statusRef.current)) {
      return;
    }
    bottomSheetRef.current?.expand(...args);
  }, []);
  const handleCollapse = (0, _react.useCallback)((...args) => {
    if ([_constants.MODAL_STATUS.MINIMIZED, _constants.MODAL_STATUS.MINIMIZING, _constants.MODAL_STATUS.DISMISSED, _constants.MODAL_STATUS.DISMISSING].includes(statusRef.current)) {
      return;
    }
    bottomSheetRef.current?.collapse(...args);
  }, []);
  const handleClose = (0, _react.useCallback)((...args) => {
    if ([_constants.MODAL_STATUS.MINIMIZED, _constants.MODAL_STATUS.MINIMIZING, _constants.MODAL_STATUS.DISMISSED, _constants.MODAL_STATUS.DISMISSING, _constants.MODAL_STATUS.CLOSED].includes(statusRef.current)) {
      return;
    }
    bottomSheetRef.current?.close(...args);
  }, []);
  const handleForceClose = (0, _react.useCallback)((...args) => {
    if ([_constants.MODAL_STATUS.MINIMIZED, _constants.MODAL_STATUS.MINIMIZING, _constants.MODAL_STATUS.DISMISSED, _constants.MODAL_STATUS.DISMISSING, _constants.MODAL_STATUS.CLOSED].includes(statusRef.current)) {
      return;
    }
    bottomSheetRef.current?.forceClose(...args);
  }, []);
  //#endregion

  //#region bottom sheet modal methods
  // biome-ignore lint/correctness/useExhaustiveDependencies(ref): ref is a stable object
  const handlePresent = (0, _react.useCallback)(function handlePresent(_data) {
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheetModal',
        method: handlePresent.name,
        params: {
          currentIndexRef: currentIndexRef.current,
          nextIndexRef: nextIndexRef.current,
          status: statusRef.current
        }
      });
    }
    requestAnimationFrame(() => {
      if (mount && bottomSheetRef.current) {
        statusRef.current = _constants.MODAL_STATUS.ANIMATING;
        bottomSheetRef.current.snapToIndex(index);
      }
      setState({
        mount: true,
        data: _data
      });
      mountSheet(key, ref, stackBehavior);
    });
  }, [index, key, stackBehavior, mount, mountSheet]);
  const handleDismiss = (0, _react.useCallback)(function handleDismiss(animationConfigs) {
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheetModal',
        method: handleDismiss.name,
        params: {
          status: statusRef.current
        }
      });
    }

    /**
     * if the modal position is already in a closed position,
     * then we unmount the node and early exit.
     */
    if ([_constants.MODAL_STATUS.CLOSED, _constants.MODAL_STATUS.MINIMIZED].includes(statusRef.current) || statusRef.current === _constants.MODAL_STATUS.DISMISSING && currentIndexRef.current === -1) {
      statusRef.current = _constants.MODAL_STATUS.DISMISSED;
      unmount();
      return;
    }
    statusRef.current = _constants.MODAL_STATUS.DISMISSING;
    willUnmountSheet(key);
    bottomSheetRef.current?.forceClose(animationConfigs);
  }, [willUnmountSheet, unmount, key]);
  const handleMinimize = (0, _react.useCallback)(function handleMinimize() {
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheetModal',
        method: handleMinimize.name,
        params: {
          index,
          currentIndexRef: currentIndexRef.current,
          status: statusRef.current
        }
      });
    }

    /**
     * if the modal is minimized or animating to a minimized position,
     * then we early exit the method.
     */
    if (statusRef.current === _constants.MODAL_STATUS.MINIMIZED || statusRef.current === _constants.MODAL_STATUS.MINIMIZING) {
      return;
    }

    /**
     * if modal got minimized before it finish its mounting
     * animation, we set the `restoreIndexRef` to the
     * provided index.
     */
    if (currentIndexRef.current === -1) {
      restoreIndexRef.current = index;
    } else {
      restoreIndexRef.current = currentIndexRef.current;
    }
    statusRef.current = _constants.MODAL_STATUS.MINIMIZING;
    bottomSheetRef.current?.close();
  }, [index]);
  const handleRestore = (0, _react.useCallback)(function handleRestore() {
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheetModal',
        method: handleRestore.name,
        params: {
          status: statusRef.current
        }
      });
    }

    /**
     * we only restore if the modal is minimized or going to be.
     */
    const minimizedOrGoingToBe = [_constants.MODAL_STATUS.MINIMIZING, _constants.MODAL_STATUS.MINIMIZED].includes(statusRef.current);
    if (!minimizedOrGoingToBe) {
      return;
    }
    bottomSheetRef.current?.snapToIndex(restoreIndexRef.current);
  }, []);
  //#endregion

  //#region callbacks
  const handlePortalOnUnmount = (0, _react.useCallback)(function handlePortalOnUnmount() {
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheetModal',
        method: 'handlePortalOnUnmount',
        params: {
          status: statusRef.current
        }
      });
    }
    if (statusRef.current === _constants.MODAL_STATUS.INITIAL) {
      return;
    }

    /**
     * if modal is already in minimized/closed position, then
     * unmount its node and early exit the method.
     */
    if (statusRef.current === _constants.MODAL_STATUS.MINIMIZED || statusRef.current === _constants.MODAL_STATUS.DISMISSED || currentIndexRef.current === -1) {
      unmount();
      return;
    }
    statusRef.current = _constants.MODAL_STATUS.DISMISSING;
    willUnmountSheet(key);
    bottomSheetRef.current?.close();
  }, [key, unmount, willUnmountSheet]);
  const handlePortalRender = (0, _react.useCallback)(function handlePortalRender(render) {
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheetModal',
        method: 'handlePortalRender',
        params: {
          status: statusRef.current
        }
      });
    }
    if ([_constants.MODAL_STATUS.DISMISSING].includes(statusRef.current)) {
      return;
    }
    render();
  }, []);
  const handleBottomSheetOnChange = (0, _react.useCallback)(function handleBottomSheetOnChange(_index, _position, _type) {
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheetModal',
        method: handleBottomSheetOnChange.name,
        category: 'callback',
        params: {
          status: statusRef.current
        }
      });
    }
    currentIndexRef.current = _index;
    nextIndexRef.current = null;
    statusRef.current = _index === -1 ? _constants.MODAL_STATUS.MINIMIZED : _constants.MODAL_STATUS.PRESENTED;
    if (_providedOnChange) {
      _providedOnChange(_index, _position, _type);
    }
  }, [_providedOnChange]);
  const handleBottomSheetOnAnimate = (0, _react.useCallback)((fromIndex, toIndex, fromPosition, toPosition) => {
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheetModal',
        method: 'handleBottomSheetOnAnimate',
        category: 'callback',
        params: {
          status: statusRef.current
        }
      });
    }
    nextIndexRef.current = toIndex;

    /**
     * we do not want to override the pre-set status for minimizing or dismissing,
     * as they need to be set manually.
     */
    const currentStatusIsDismissingOrMinimizing = [_constants.MODAL_STATUS.DISMISSING, _constants.MODAL_STATUS.MINIMIZING].includes(statusRef.current);
    if (!(currentStatusIsDismissingOrMinimizing && toIndex === -1)) {
      statusRef.current = _constants.MODAL_STATUS.ANIMATING;
    }
    if (_providedOnAnimate) {
      _providedOnAnimate(fromIndex, toIndex, fromPosition, toPosition);
    }
  }, [_providedOnAnimate]);
  const handleBottomSheetOnClose = (0, _react.useCallback)(function handleBottomSheetOnClose() {
    if (__DEV__) {
      (0, _utilities.print)({
        component: 'BottomSheetModal',
        method: 'handleBottomSheetOnClose',
        category: 'callback',
        params: {
          status: statusRef.current
        }
      });
    }
    if (statusRef.current === _constants.MODAL_STATUS.DISMISSING) {
      statusRef.current = _constants.MODAL_STATUS.DISMISSED;
    } else if (statusRef.current === _constants.MODAL_STATUS.MINIMIZING) {
      statusRef.current = _constants.MODAL_STATUS.MINIMIZED;
    } else {
      statusRef.current = enableDismissOnClose ? _constants.MODAL_STATUS.DISMISSED : _constants.MODAL_STATUS.CLOSED;
    }
    if (statusRef.current !== _constants.MODAL_STATUS.DISMISSED) {
      return;
    }
    unmount();
  }, [enableDismissOnClose, unmount]);
  //#endregion

  //#region expose methods
  (0, _react.useImperativeHandle)(ref, () => ({
    // sheet
    snapToIndex: handleSnapToIndex,
    snapToPosition: handleSnapToPosition,
    expand: handleExpand,
    collapse: handleCollapse,
    close: handleClose,
    forceClose: handleForceClose,
    // modal methods
    dismiss: handleDismiss,
    present: handlePresent,
    // internal
    minimize: handleMinimize,
    restore: handleRestore,
    status: statusRef
  }));
  //#endregion

  // render
  return mount ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_portal.Portal, {
    name: key,
    hostName: hostName,
    handleOnMount: handlePortalRender,
    handleOnUpdate: handlePortalRender,
    handleOnUnmount: handlePortalOnUnmount,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(ContainerComponent, {
      children: /*#__PURE__*/(0, _react.createElement)(_bottomSheet.default, {
        ...bottomSheetProps,
        ref: bottomSheetRef,
        key: key,
        index: index,
        snapPoints: snapPoints,
        enablePanDownToClose: enablePanDownToClose,
        animateOnMount: animateOnMount,
        containerLayoutState: containerLayoutState,
        onChange: handleBottomSheetOnChange,
        onClose: handleBottomSheetOnClose,
        onAnimate: handleBottomSheetOnAnimate,
        $modal: true
      }, typeof Content === 'function' ? Content({
        data
      }) : Content)
    }, key)
  }, key) : null;
}
const BottomSheetModal = /*#__PURE__*/(0, _react.memo)(/*#__PURE__*/(0, _react.forwardRef)(BottomSheetModalComponent));
BottomSheetModal.displayName = 'BottomSheetModal';
var _default = exports.default = BottomSheetModal;
//# sourceMappingURL=BottomSheetModal.js.map