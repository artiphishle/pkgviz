import type React from 'react';

import type { InteractionPolicy } from './interactionPolicy';

export type PopoverPlacement =
  'bottom-start' | 'bottom' | 'bottom-end' | 'top-start' | 'top' | 'top-end';

export interface PopoverAnchorRenderProps {
  close: () => void;
  open: boolean;
  toggle: () => void;
}

export interface PopoverProps {
  anchor: (controls: PopoverAnchorRenderProps) => React.ReactNode;
  children?: React.ReactNode;
  closeOnOutsidePress?: boolean;
  defaultOpen?: boolean;
  interactionPolicy?: InteractionPolicy;
  offset?: number;
  onOpenChange?: ((open: boolean) => void) | undefined;
  open?: boolean;
  placement?: PopoverPlacement;
  testID?: string;
}
