import type React from 'react';
import type { PressableProps, ViewProps } from 'react-native';

import type { InteractionPolicy, InteractionPolicyProps } from './interactionPolicy';

export type AccordionMode = 'single' | 'multiple';

interface AccordionBaseProps extends Omit<ViewProps, 'children'>, InteractionPolicyProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionSingleProps extends AccordionBaseProps {
  type?: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  collapsible?: boolean;
}

export interface AccordionMultipleProps extends AccordionBaseProps {
  type: 'multiple';
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: readonly string[]) => void;
  collapsible?: never;
}

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

export interface AccordionItemProps extends Omit<ViewProps, 'children'>, InteractionPolicyProps {
  value: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionTriggerProps
  extends
    Omit<
      PressableProps,
      'accessibilityRole' | 'accessibilityState' | 'children' | 'disabled' | 'onPress'
    >,
    InteractionPolicyProps {
  children?: PressableProps['children'];
  disabled?: boolean;
}

export interface AccordionContentProps extends Omit<ViewProps, 'children'> {
  children?: React.ReactNode;
  forceMount?: boolean;
}

export interface AccordionContextValue {
  disabled: boolean;
  interactionPolicy: InteractionPolicy;
  mode: AccordionMode;
  openValues: readonly string[];
  toggleValue: (value: string) => void;
}

export interface AccordionItemContextValue {
  contentId: string;
  disabled: boolean;
  interactionPolicy: InteractionPolicy;
  open: boolean;
  toggle: () => void;
  triggerId: string;
  value: string;
}
