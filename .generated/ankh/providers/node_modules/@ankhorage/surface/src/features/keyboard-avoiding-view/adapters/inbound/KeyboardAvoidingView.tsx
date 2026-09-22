import React from 'react';
import { KeyboardAvoidingView as ReactNativeKeyboardAvoidingView } from 'react-native';

import type { KeyboardAvoidingViewProps } from '../../../../types/keyboard-avoiding-view';

/*** Preserves React Native keyboard avoidance behind the stable Surface feature boundary. */
export function KeyboardAvoidingView(props: KeyboardAvoidingViewProps) {
  return <ReactNativeKeyboardAvoidingView {...props} />;
}
