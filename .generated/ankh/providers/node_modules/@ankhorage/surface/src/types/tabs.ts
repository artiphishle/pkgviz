import type React from 'react';

import type { InteractionPolicy } from './interactionPolicy';
import type { ViewStyleProps } from './layout';

export interface TabsProps extends ViewStyleProps {
  children?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: ((value: string) => void) | undefined;
  testID?: string;
}

export interface TabListProps {
  children?: React.ReactNode;
  testID?: string;
}

export interface TabProps {
  value: string;
  children?: React.ReactNode;
  disabled?: boolean;
  interactionPolicy?: InteractionPolicy;
  testID?: string;
}

export interface TabPanelProps extends ViewStyleProps {
  value: string;
  children?: React.ReactNode;
  testID?: string;
}

export interface TabRegistration {
  disabled: boolean;
  focus: () => void;
  value: string;
}

export interface TabsContextValue {
  activeValue: string | undefined;
  focusedValue: string | undefined;
  getPanelId: (value: string) => string;
  getTabId: (value: string) => string;
  registerTab: (tab: TabRegistration) => void;
  setActiveValue: (value: string) => void;
  setFocusedValue: (value: string | undefined) => void;
  tabs: readonly TabRegistration[];
  unregisterTab: (value: string) => void;
}

export type TabNavigationKey =
  'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'Home' | 'End';
