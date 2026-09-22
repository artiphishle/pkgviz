import React, { type Ref } from 'react';
import type { FlatListProps } from 'react-native';
import type { AnimatedProps } from 'react-native-reanimated';
import type { BottomSheetScrollableProps } from './types';
/**
 * Minimal subset of FlashListProps needed for BottomSheetFlashList.
 * Defined locally to avoid requiring @shopify/flash-list as a dependency,
 * since the runtime import is optional (try/catch require).
 */
interface FlashListProps<T> extends FlatListProps<T> {
    estimatedItemSize?: number;
}
export type BottomSheetFlashListProps<T> = Omit<AnimatedProps<FlashListProps<T>>, 'decelerationRate' | 'onScroll' | 'scrollEventThrottle'> & BottomSheetScrollableProps & {
    ref?: Ref<React.FC>;
};
export declare const BottomSheetFlashList: React.MemoExoticComponent<React.ForwardRefExoticComponent<Omit<BottomSheetFlashListProps<any>, "ref"> & React.RefAttributes<React.FC<{}>>>>;
declare const _default: <T>(props: BottomSheetFlashListProps<T>) => ReturnType<typeof BottomSheetFlashList>;
export default _default;
//# sourceMappingURL=BottomSheetFlashList.d.ts.map