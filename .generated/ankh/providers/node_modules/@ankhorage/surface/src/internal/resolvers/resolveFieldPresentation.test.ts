import { describe, expect, it } from 'bun:test';

import { resolveFieldPresentation } from './resolveFieldPresentation';
import { resolveFieldState } from './resolveFieldState';

describe('resolveFieldPresentation', () => {
  it('keeps label and helper text presentation aligned for default fields', () => {
    expect(resolveFieldPresentation(resolveFieldState({}))).toEqual({
      helperEmphasis: 'default',
      labelEmphasis: 'default',
    });
  });

  it('mutes both label and helper text for disabled and read-only fields', () => {
    expect(resolveFieldPresentation(resolveFieldState({ disabled: true }))).toEqual({
      helperEmphasis: 'muted',
      labelEmphasis: 'muted',
    });
    expect(resolveFieldPresentation(resolveFieldState({ readOnly: true }))).toEqual({
      helperEmphasis: 'muted',
      labelEmphasis: 'muted',
    });
  });

  it('elevates invalid fields to the error color', () => {
    expect(resolveFieldPresentation(resolveFieldState({ invalid: true, readOnly: true }))).toEqual({
      helperColor: 'error',
      helperEmphasis: 'default',
      labelColor: 'error',
      labelEmphasis: 'default',
    });
  });
});
