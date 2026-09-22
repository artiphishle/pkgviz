import React from 'react';
import { View } from 'react-native';

import type { AccordionItemProps } from '../../../../types/accordion';
import { AccordionContext } from './AccordionContext';
import { AccordionItemContext } from './AccordionItemContext';

/*** Provides one accordion item's value, state, and trigger/content identifiers. */
export function AccordionItem({
  children,
  disabled = false,
  interactionPolicy,
  value,
  ...viewProps
}: AccordionItemProps) {
  const accordion = React.use(AccordionContext);
  if (!accordion) throw new Error('AccordionItem must be rendered inside Accordion.');

  const reactId = React.useId();
  const resolvedDisabled = accordion.disabled || disabled;
  const resolvedInteractionPolicy = interactionPolicy ?? accordion.interactionPolicy;
  const open = accordion.openValues.includes(value);
  const toggle = React.useCallback(() => accordion.toggleValue(value), [accordion, value]);
  const contextValue = React.useMemo(
    () => ({
      contentId: `accordion-${reactId}-content`,
      disabled: resolvedDisabled,
      interactionPolicy: resolvedInteractionPolicy,
      open,
      toggle,
      triggerId: `accordion-${reactId}-trigger`,
      value,
    }),
    [open, reactId, resolvedDisabled, resolvedInteractionPolicy, toggle, value],
  );

  return (
    <AccordionItemContext value={contextValue}>
      <View {...viewProps}>{children}</View>
    </AccordionItemContext>
  );
}
