import { describe, expect, it } from 'bun:test';

import { resolveInteractiveState } from './resolveInteractiveState';

describe('resolveInteractiveState', () => {
  it('freezes the interaction state shape to booleans', () => {
    expect(resolveInteractiveState({ hovered: true, pressed: 1 as never })).toEqual({
      pressed: true,
      hovered: true,
      focused: false,
      disabled: false,
    });
  });
});
