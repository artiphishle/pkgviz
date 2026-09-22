import type { AccordionMode } from '../../../types/accordion';

/*** Resolves the next immutable set of open accordion item values. */
export function resolveAccordionToggle({
  collapsible,
  mode,
  openValues,
  value,
}: ResolveAccordionToggleInput): readonly string[] {
  if (mode === 'multiple') {
    return openValues.includes(value)
      ? openValues.filter((openValue) => openValue !== value)
      : [...openValues, value];
  }

  if (openValues.includes(value)) {
    return collapsible ? [] : openValues;
  }

  return [value];
}

interface ResolveAccordionToggleInput {
  collapsible: boolean;
  mode: AccordionMode;
  openValues: readonly string[];
  value: string;
}
