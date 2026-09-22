import { describe, expect, test } from 'bun:test';

import { getBreakpointFromWidth } from './getBreakpointFromWidth';

describe('getBreakpointFromWidth', () => {
  test('resolves expected breakpoints', () => {
    expect(getBreakpointFromWidth(0)).toBe('base');
    expect(getBreakpointFromWidth(479)).toBe('base');
    expect(getBreakpointFromWidth(480)).toBe('sm');
    expect(getBreakpointFromWidth(767)).toBe('sm');
    expect(getBreakpointFromWidth(768)).toBe('md');
    expect(getBreakpointFromWidth(1024)).toBe('lg');
    expect(getBreakpointFromWidth(1280)).toBe('xl');
  });
});
