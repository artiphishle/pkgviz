import type React from 'react';
import type {
  StyleProp,
  TextInputProps as ReactNativeTextInputProps,
  TextStyle,
} from 'react-native';

import type { ControlSize } from '../internal/resolvers/resolveControlSize';
import type { InteractionPolicy } from './interactionPolicy';

export interface TextInputProps extends Omit<
  ReactNativeTextInputProps,
  | 'defaultValue'
  | 'editable'
  | 'onChangeText'
  | 'placeholderTextColor'
  | 'style'
  | 'testID'
  | 'value'
> {
  value?: string;
  defaultValue?: string;
  onChangeText?: ((text: string) => void) | undefined;
  placeholder?: string;
  size?: ControlSize;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  leadingAccessory?: React.ReactNode;
  trailingAccessory?: React.ReactNode;
  interactionPolicy?: InteractionPolicy;
  style?: StyleProp<TextStyle>;
  testID?: string;
}
