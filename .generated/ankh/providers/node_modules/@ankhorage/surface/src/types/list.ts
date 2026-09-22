import type React from 'react';

import type { InteractionPolicyProps } from './interactionPolicy';

export interface ListProps {
  children?: React.ReactNode;
  testID?: string;
}

export interface ListItemProps extends InteractionPolicyProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  onPress?: (() => void) | undefined;
  disabled?: boolean;
  selected?: boolean;
  compact?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}
