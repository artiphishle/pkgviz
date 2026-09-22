import React from 'react';
import type { ViewProps, ViewStyle } from 'react-native';
import { type AnimatedStyle } from 'react-native-reanimated';
import type { NullableAccessibilityProps } from '../../types';
import type { BottomSheetProps } from './types';
type BottomSheetContent = {
    style?: AnimatedStyle<ViewStyle>;
} & Pick<BottomSheetProps, 'children' | 'detached' | 'animationConfigs' | 'overrideReduceMotion' | 'keyboardBehavior'> & NullableAccessibilityProps & ViewProps;
declare function BottomSheetContentComponent({ detached, animationConfigs, overrideReduceMotion, keyboardBehavior, accessible, accessibilityLabel, accessibilityHint, accessibilityRole, children, }: BottomSheetContent): React.JSX.Element;
export declare const BottomSheetContent: React.MemoExoticComponent<typeof BottomSheetContentComponent>;
export {};
//# sourceMappingURL=BottomSheetContent.d.ts.map