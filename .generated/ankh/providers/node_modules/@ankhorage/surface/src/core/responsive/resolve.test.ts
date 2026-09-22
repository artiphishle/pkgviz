import { describe, expect, test } from 'bun:test';

import { resolveResponsive } from './resolve';

describe('resolveResponsive', () => {
  test('returns plain value when non-responsive', () => {
    expect(resolveResponsive(12, 'md')).toBe(12);
  });

  test('resolves value at current breakpoint', () => {
    expect(resolveResponsive({ base: 8, md: 16 }, 'md')).toBe(16);
  });

  test('falls back to nearest lower breakpoint', () => {
    expect(resolveResponsive({ base: 8, md: 16 }, 'lg')).toBe(16);
  });

  test('falls back to base when no lower explicit value exists', () => {
    expect(resolveResponsive({ base: 8, xl: 24 }, 'md')).toBe(8);
  });

  test('returns undefined when value is undefined', () => {
    expect(resolveResponsive(undefined, 'md')).toBeUndefined();
  });
});
