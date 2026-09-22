import type React from 'react';

import type { SurfaceProps, SurfaceVariant } from './surface';

export interface CardProps extends Omit<SurfaceProps, 'children' | 'variant'> {
  children?: React.ReactNode;
  variant?: SurfaceVariant;
  onPress?: (() => void) | undefined;
  disabled?: boolean;
  testID?: string;
}
