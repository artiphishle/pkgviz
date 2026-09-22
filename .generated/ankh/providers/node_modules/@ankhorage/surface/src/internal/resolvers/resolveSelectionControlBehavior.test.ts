import { describe, expect, it } from 'bun:test';

import { resolveSelectionControlNextChecked } from './resolveSelectionControlBehavior';

describe('resolveSelectionControlNextChecked', () => {
  it('toggles checkbox and switch values when interactive', () => {
    expect(
      resolveSelectionControlNextChecked({
        checked: false,
        kind: 'checkbox',
      }),
    ).toBe(true);
    expect(
      resolveSelectionControlNextChecked({
        checked: true,
        kind: 'switch',
      }),
    ).toBe(false);
  });

  it('allows radio selection once but not repeat activation', () => {
    expect(
      resolveSelectionControlNextChecked({
        checked: false,
        kind: 'radio',
      }),
    ).toBe(true);
    expect(
      resolveSelectionControlNextChecked({
        checked: true,
        kind: 'radio',
      }),
    ).toBeNull();
  });

  it('keeps read-only and disabled controls focusable but non-mutating', () => {
    expect(
      resolveSelectionControlNextChecked({
        checked: false,
        kind: 'checkbox',
        readOnly: true,
      }),
    ).toBeNull();
    expect(
      resolveSelectionControlNextChecked({
        checked: false,
        disabled: true,
        kind: 'switch',
      }),
    ).toBeNull();
  });
});
