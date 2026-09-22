import { type SharedValue } from 'react-native-reanimated';
import type { ContainerLayoutState } from '../types';
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
export declare function useAnimatedLayout(containerLayoutState: SharedValue<ContainerLayoutState> | undefined, topInset: number, bottomInset: number, modal?: boolean, shouldOverrideHandleHeight?: boolean): import("react-native-reanimated/lib/typescript/commonTypes").Mutable<{
    window: {
        height: number;
        width: number;
    };
    rawContainerHeight: number;
    containerHeight: number;
    containerOffset: Required<import("react-native").Insets>;
    handleHeight: number;
    footerHeight: number;
    contentHeight: number;
}>;
//# sourceMappingURL=useAnimatedLayout.d.ts.map