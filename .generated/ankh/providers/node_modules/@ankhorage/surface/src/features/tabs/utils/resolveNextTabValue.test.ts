import { describe, expect, it } from 'bun:test';

import { resolveNextTabValue } from './resolveNextTabValue';

const tabs = [
  { disabled: false, focus: () => undefined, value: 'overview' },
  { disabled: true, focus: () => undefined, value: 'disabled' },
  { disabled: false, focus: () => undefined, value: 'details' },
] as const;

describe('resolveNextTabValue', () => {
  it('skips disabled tabs when cycling', () => {
    expect(resolveNextTabValue(tabs, 'overview', 'ArrowRight')).toBe('details');
    expect(resolveNextTabValue(tabs, 'details', 'ArrowRight')).toBe('overview');
  });

  it('supports home and end navigation', () => {
    expect(resolveNextTabValue(tabs, 'details', 'Home')).toBe('overview');
    expect(resolveNextTabValue(tabs, 'overview', 'End')).toBe('details');
  });
});
