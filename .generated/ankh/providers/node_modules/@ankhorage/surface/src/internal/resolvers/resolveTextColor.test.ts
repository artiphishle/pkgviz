import { describe, expect, it } from 'bun:test';

import { createTheme } from '../../features/theme/application/use-cases/createTheme';
import { resolveTextColor } from './resolveTextColor';

describe('resolveTextColor', () => {
  it('maps semantic text emphases through content aliases', () => {
    const theme = createTheme();

    expect(resolveTextColor(theme, 'default')).toBe(theme.semantics.content.default);
    expect(resolveTextColor(theme, 'muted')).toBe(theme.semantics.content.muted);
    expect(resolveTextColor(theme, 'subtle')).toBe(theme.semantics.content.subtle);
    expect(resolveTextColor(theme, 'inverse')).toBe(theme.semantics.content.inverse);
  });

  it('supports semantic colors for shared field and messaging copy', () => {
    const theme = createTheme();

    expect(resolveTextColor(theme, 'default', 'danger')).toBe(theme.semantics.action.danger.base);
    expect(resolveTextColor(theme, 'default', 'success')).toBe(theme.semantics.success.base);
    expect(resolveTextColor(theme, 'default', 'warning')).toBe(theme.semantics.warning.base);
    expect(resolveTextColor(theme, 'default', 'error')).toBe(theme.semantics.error.base);
    expect(resolveTextColor(theme, 'default', 'info')).toBe(theme.semantics.info.base);
  });

  it('maps inverse emphasis with a semantic color to role foreground text', () => {
    const theme = createTheme();

    expect(resolveTextColor(theme, 'inverse', 'primary')).toBe(
      theme.semantics.action.primary.onSolidText,
    );
    expect(resolveTextColor(theme, 'inverse', 'error')).toBe(theme.semantics.error.onSolidText);
  });
});
