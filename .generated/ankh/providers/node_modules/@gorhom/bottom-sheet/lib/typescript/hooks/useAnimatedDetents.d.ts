import { type SharedValue } from 'react-native-reanimated';
import type { BottomSheetProps } from '../components/bottomSheet';
import type { DetentsState, LayoutState } from '../types';
/**
 * A custom hook that computes and returns the animated detent positions for a bottom sheet component.
 *
 * This hook normalizes the provided snap points (detents), optionally adds a dynamic detent based on content size,
 * and calculates key positions such as the highest detent and the closed position. It supports both static and dynamic
 * sizing, and adapts to modal and detached sheet modes.
 *
 * @param detents - The snap points for the bottom sheet, which can be an array or an object with a `value` property.
 * @param layoutState - A shared animated value containing the current layout state (container, handle, and content heights).
 * @param enableDynamicSizing - Whether dynamic sizing based on content height is enabled.
 * @param maxDynamicContentSize - The maximum allowed content size for dynamic sizing.
 * @param detached - Whether the bottom sheet is in detached mode.
 * @param $modal - Whether the bottom sheet is presented as a modal.
 * @param bottomInset - The bottom inset to apply when the sheet is modal or detached (default is 0).
 */
export declare const useAnimatedDetents: (detents: BottomSheetProps["snapPoints"], layoutState: SharedValue<LayoutState>, enableDynamicSizing: BottomSheetProps["enableDynamicSizing"], maxDynamicContentSize: BottomSheetProps["maxDynamicContentSize"], detached: BottomSheetProps["detached"], $modal: BottomSheetProps["$modal"], bottomInset?: BottomSheetProps["bottomInset"]) => import("react-native-reanimated").DerivedValue<DetentsState>;
//# sourceMappingURL=useAnimatedDetents.d.ts.map