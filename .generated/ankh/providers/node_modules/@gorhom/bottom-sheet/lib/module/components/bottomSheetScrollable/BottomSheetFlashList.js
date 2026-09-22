"use strict";

import React, { forwardRef, memo, useMemo } from 'react';
import BottomSheetScrollView from './BottomSheetScrollView';

/**
 * Minimal subset of FlashListProps needed for BottomSheetFlashList.
 * Defined locally to avoid requiring @shopify/flash-list as a dependency,
 * since the runtime import is optional (try/catch require).
 */
import { jsx as _jsx } from "react/jsx-runtime";
let FlashList;
// since FlashList is not a dependency for the library
// we try to import it using metro optional import
try {
  FlashList = require('@shopify/flash-list');
} catch (_) {}
const BottomSheetFlashListComponent = /*#__PURE__*/forwardRef((props, ref) => {
  //#region props
  const {
    focusHook,
    scrollEventsHandlersHook,
    enableFooterMarginAdjustment,
    ...rest
    // biome-ignore lint: to be addressed!
  } = props;
  //#endregion

  useMemo(() => {
    if (!FlashList) {
      throw 'You need to install FlashList first, `yarn install @shopify/flash-list`';
    }
    console.warn('BottomSheetFlashList is deprecated, please use useBottomSheetScrollableCreator instead.');
  }, []);

  //#region render
  const renderScrollComponent = useMemo(() => /*#__PURE__*/forwardRef(
  // @ts-expect-error
  ({
    data,
    ...props
  }, ref) => {
    return (
      /*#__PURE__*/
      // @ts-expect-error
      _jsx(BottomSheetScrollView, {
        ref: ref,
        ...props,
        focusHook: focusHook,
        scrollEventsHandlersHook: scrollEventsHandlersHook,
        enableFooterMarginAdjustment: enableFooterMarginAdjustment
      })
    );
  }), [focusHook, scrollEventsHandlersHook, enableFooterMarginAdjustment]);
  return /*#__PURE__*/_jsx(FlashList.FlashList, {
    ref: ref,
    renderScrollComponent: renderScrollComponent,
    ...rest
  });
  //#endregion
});
export const BottomSheetFlashList = /*#__PURE__*/memo(BottomSheetFlashListComponent);
export default BottomSheetFlashList;
//# sourceMappingURL=BottomSheetFlashList.js.map