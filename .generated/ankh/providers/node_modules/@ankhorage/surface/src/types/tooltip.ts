import type React from 'react';

import type { InteractionPolicy } from './interactionPolicy';

export interface TooltipProps {
  children?: React.ReactNode;
  content?: React.ReactNode;
  delay?: number;
  interactionPolicy?: InteractionPolicy;
  placement?: 'top' | 'bottom';
  testID?: string;
}
