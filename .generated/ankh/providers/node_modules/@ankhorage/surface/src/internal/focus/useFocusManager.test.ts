import { describe, expect, it } from 'bun:test';

import { getFocusableElements } from './useFocusManager';

interface MockFocusableTarget {
  disabled?: boolean;
  focus: () => void;
  getAttribute?: (name: string) => string | null;
  hidden?: boolean;
  tabIndex?: number;
}

describe('getFocusableElements', () => {
  it('filters disabled, hidden, and aria-hidden nodes from focus traps', () => {
    const active: MockFocusableTarget = {
      focus: () => undefined,
      getAttribute: () => null,
    };
    const disabled: MockFocusableTarget = {
      disabled: true,
      focus: () => undefined,
      getAttribute: () => null,
    };
    const ariaHidden: MockFocusableTarget = {
      focus: () => undefined,
      getAttribute: (name) => (name === 'aria-hidden' ? 'true' : null),
    };
    const untabbable: MockFocusableTarget = {
      focus: () => undefined,
      getAttribute: (name) => (name === 'tabindex' ? '-1' : null),
    };

    const container = {
      querySelectorAll: () => [active, disabled, ariaHidden, untabbable],
    };

    expect(getFocusableElements(container)).toEqual([active]);
  });

  it('returns an empty list when no DOM-like query API is available', () => {
    expect(getFocusableElements(null)).toEqual([]);
    expect(getFocusableElements({})).toEqual([]);
  });
});
