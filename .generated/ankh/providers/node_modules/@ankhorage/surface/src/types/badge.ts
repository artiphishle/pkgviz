import type React from 'react';

import type { ControlSize } from '../internal/resolvers/resolveControlSize';
import type { ButtonVariant } from '../internal/resolvers/resolveInteractiveColors';
import type { SurfaceColor } from './surfaceColor';

export interface BadgeProps {
  content?: React.ReactNode;
  variant?: Extract<ButtonVariant, 'solid' | 'soft' | 'outline'>;
  color?: SurfaceColor;
  size?: ControlSize;
  testID?: string;
}
