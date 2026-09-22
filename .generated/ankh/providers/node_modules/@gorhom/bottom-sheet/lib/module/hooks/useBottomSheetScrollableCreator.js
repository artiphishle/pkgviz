"use strict";

import { useCallback } from 'react';
import { BottomSheetScrollView } from '../components/bottomSheetScrollable';
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * A custom hook that creates a scrollable component for third-party libraries
 * like `LegendList` or `FlashList` to integrate the interaction and scrolling
 * behaviors with th BottomSheet component.
 *
 * @param configs - Configuration options for the scrollable creator.
 * @param configs.focusHook - This needed when bottom sheet used with multiple scrollables to allow bottom sheet
 * detect the current scrollable ref, especially when used with `React Navigation`.
 * You will need to provide `useFocusEffect` from `@react-navigation/native`.
 * @param configs.scrollEventsHandlersHook - Custom hook to provide scroll events handler, which will allow advance and
 * customize handling for scrollables.
 * @param configs.enableFooterMarginAdjustment - Adjust the scrollable bottom margin to avoid the animated footer.
 *
 * @example
 * ```tsx
 * const BottomSheetLegendListScrollable = useBottomSheetScrollableCreator();
 *
 * // Usage in JSX
 * <LegendList
 *  renderScrollComponent={BottomSheetLegendListScrollable}
 * />
 * ```
 */
// biome-ignore lint/suspicious/noExplicitAny: out of my control
export function useBottomSheetScrollableCreator({
  focusHook,
  scrollEventsHandlersHook,
  enableFooterMarginAdjustment
} = {}) {
  return useCallback(function useBottomSheetScrollableCreator(
  // @ts-expect-error
  {
    data: _,
    ...props
  }, ref) {
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
  }, [focusHook, scrollEventsHandlersHook, enableFooterMarginAdjustment]);
}
//# sourceMappingURL=useBottomSheetScrollableCreator.js.map