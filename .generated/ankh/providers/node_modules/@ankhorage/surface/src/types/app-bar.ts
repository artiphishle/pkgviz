import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { ViewProps } from './layout';

export interface AppBarProps extends Omit<ViewProps, 'children'> {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  children?: React.ReactNode;
  safeAreaTop?: boolean;
  divider?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}
