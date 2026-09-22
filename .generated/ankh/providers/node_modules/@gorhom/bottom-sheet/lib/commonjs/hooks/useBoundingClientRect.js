"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useBoundingClientRect = useBoundingClientRect;
var _react = require("react");
var _isFabricInstalled = require("../utilities/isFabricInstalled");
/**
 * A custom hook that retrieves the bounding client rectangle of a given `ref` element
 * and invokes a handler function with the layout information.
 *
 * This hook is designed to work with React Native's Fabric architecture and provides
 * support for both `unstable_getBoundingClientRect` and `getBoundingClientRect` methods.
 *
 * @param ref - A `RefObject` pointing to a `View` or `null`. The bounding client rectangle
 *              will be retrieved from this reference.
 * @param handler - A callback function that will be invoked with the layout information
 *                  of the referenced element.
 *
 * @remarks
 * - The hook uses `useLayoutEffect` to ensure the layout information is retrieved
 *   after the DOM updates.
 * - The `isFabricInstalled` function is used to determine if the Fabric architecture
 *   is available.
 * - The `unstable_getBoundingClientRect` method is used if available, falling back
 *   to `getBoundingClientRect` otherwise.
 *
 * @example
 * ```tsx
 * const ref = useRef<View | null>(null);
 * useBoundingClientRect(ref, (layout) => {
 *   console.log('Bounding client rect:', layout);
 * });
 * ```
 */
function useBoundingClientRect(ref, handler) {
  if (!(0, _isFabricInstalled.isFabricInstalled)()) {
    return;
  }

  // biome-ignore lint/correctness/useHookAtTopLevel: `isFabricInstalled` is a constant that will not change during the runtime
  (0, _react.useLayoutEffect)(() => {
    if (!ref || !ref.current) {
      return;
    }
    if (
    // @ts-expect-error 👉 https://github.com/facebook/react/commit/53b1f69ba
    ref.current.unstable_getBoundingClientRect !== null &&
    // @ts-expect-error 👉 https://github.com/facebook/react/commit/53b1f69ba
    typeof ref.current.unstable_getBoundingClientRect === 'function') {
      // @ts-expect-error https://github.com/facebook/react/commit/53b1f69ba
      const layout = ref.current.unstable_getBoundingClientRect();
      handler(layout);
      return;
    }
    if (
    // @ts-expect-error once it `unstable_getBoundingClientRect` gets stable 🤞.
    ref.current.getBoundingClientRect !== null &&
    // @ts-expect-error once it `unstable_getBoundingClientRect` gets stable 🤞.
    typeof ref.current.getBoundingClientRect === 'function') {
      // @ts-expect-error once it `unstable_getBoundingClientRect` gets stable.
      const layout = ref.current.getBoundingClientRect();
      handler(layout);
    }
  });
}
//# sourceMappingURL=useBoundingClientRect.js.map