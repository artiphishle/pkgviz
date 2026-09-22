import React from 'react';
import { View } from 'react-native';

import type {
  AccordionMode,
  AccordionMultipleProps,
  AccordionProps,
  AccordionSingleProps,
} from '../../../../types/accordion';
import { resolveAccordionToggle } from '../../utils/resolveAccordionToggle';
import { AccordionContext } from './AccordionContext';

/*** Coordinates controlled or uncontrolled accordion expansion state. */
export function Accordion(props: AccordionProps) {
  const {
    children,
    collapsible = false,
    defaultValue,
    disabled = false,
    interactionPolicy = 'enabled',
    onValueChange: _onValueChange,
    type = 'single',
    value,
    ...viewProps
  } = props;
  const [uncontrolledValues, setUncontrolledValues] = React.useState<readonly string[]>(() =>
    normalizeAccordionValues(type, defaultValue),
  );
  const controlled = value !== undefined;
  const openValues = controlled ? normalizeAccordionValues(type, value) : uncontrolledValues;

  const toggleValue = React.useCallback(
    (itemValue: string) => {
      if (disabled || interactionPolicy === 'passive') return;

      const nextValues = resolveAccordionToggle({
        collapsible,
        mode: type,
        openValues,
        value: itemValue,
      });

      if (!controlled) setUncontrolledValues(nextValues);
      notifyValueChange(props, nextValues);
    },
    [collapsible, controlled, disabled, interactionPolicy, openValues, props, type],
  );

  const contextValue = React.useMemo(
    () => ({ disabled, interactionPolicy, mode: type, openValues, toggleValue }),
    [disabled, interactionPolicy, openValues, toggleValue, type],
  );

  return (
    <AccordionContext value={contextValue}>
      <View {...viewProps}>{children}</View>
    </AccordionContext>
  );
}

/*** Normalizes the public single/multiple value shapes for internal state. */
function normalizeAccordionValues(
  mode: AccordionMode,
  value: string | readonly string[] | undefined,
): readonly string[] {
  if (mode === 'multiple') {
    return typeof value === 'string' || value === undefined ? [] : value;
  }

  return typeof value === 'string' ? [value] : [];
}

/*** Emits the public value shape matching the configured accordion mode. */
function notifyValueChange(props: AccordionProps, values: readonly string[]) {
  if (props.type === 'multiple') {
    const multipleProps: AccordionMultipleProps = props;
    multipleProps.onValueChange?.(values);
    return;
  }

  const singleProps: AccordionSingleProps = props;
  singleProps.onValueChange?.(values[0]);
}
