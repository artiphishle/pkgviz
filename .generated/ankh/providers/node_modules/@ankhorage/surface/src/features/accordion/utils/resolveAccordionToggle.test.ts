import { describe, expect, test } from 'bun:test';

import { resolveAccordionToggle } from './resolveAccordionToggle';

describe('resolveAccordionToggle', () => {
  test('opens one value in single mode', () => {
    expect(
      resolveAccordionToggle({
        collapsible: false,
        mode: 'single',
        openValues: ['general'],
        value: 'appearance',
      }),
    ).toEqual(['appearance']);
  });

  test('keeps the active value open when single mode is not collapsible', () => {
    const openValues = ['general'] as const;
    expect(
      resolveAccordionToggle({
        collapsible: false,
        mode: 'single',
        openValues,
        value: 'general',
      }),
    ).toBe(openValues);
  });

  test('closes the active value when single mode is collapsible', () => {
    expect(
      resolveAccordionToggle({
        collapsible: true,
        mode: 'single',
        openValues: ['general'],
        value: 'general',
      }),
    ).toEqual([]);
  });

  test('adds and removes values independently in multiple mode', () => {
    const opened = resolveAccordionToggle({
      collapsible: false,
      mode: 'multiple',
      openValues: ['general'],
      value: 'appearance',
    });
    expect(opened).toEqual(['general', 'appearance']);
    expect(
      resolveAccordionToggle({
        collapsible: false,
        mode: 'multiple',
        openValues: opened,
        value: 'general',
      }),
    ).toEqual(['appearance']);
  });
});
