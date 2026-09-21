import { describe, expect, it } from '@artiphishle/testosterone';

import { resolveThemeMode } from '@/features/theme/utils/resolveThemeMode';

describe('[theme mode]', () => {
  it('keeps server and initial client markup light before the theme runtime mounts', () => {
    expect(resolveThemeMode(false, undefined)).toBe('light');
    expect(resolveThemeMode(false, 'dark')).toBe('light');
  });

  it('uses the resolved client theme after hydration', () => {
    expect(resolveThemeMode(true, 'dark')).toBe('dark');
    expect(resolveThemeMode(true, 'light')).toBe('light');
  });
});
