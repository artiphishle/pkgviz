import { describe, expect, it } from 'bun:test';

import { resolveFieldState } from './resolveFieldState';

describe('resolveFieldState', () => {
  it('applies field-state precedence consistently', () => {
    expect(resolveFieldState({})).toEqual({
      name: 'default',
      focused: false,
      disabled: false,
      invalid: false,
      readOnly: false,
    });

    expect(resolveFieldState({ focused: true }).name).toBe('focused');
    expect(resolveFieldState({ readOnly: true }).name).toBe('readOnly');
    expect(resolveFieldState({ invalid: true, focused: true }).name).toBe('invalid');
    expect(resolveFieldState({ disabled: true, invalid: true, focused: true }).name).toBe(
      'disabled',
    );
  });
});
