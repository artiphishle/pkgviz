import { describe, expect, it } from 'bun:test';

import { createTheme } from '../../features/theme/application/use-cases/createTheme';
import { resolveSurfaceColor } from './resolveSurfaceColor';

describe('resolveSurfaceColor', () => {
  it('maps every public surface color to a semantic role', () => {
    const theme = createTheme();

    expect(resolveSurfaceColor(theme, 'primary')).toBe(theme.semantics.action.primary);
    expect(resolveSurfaceColor(theme, 'secondary')).toBe(theme.semantics.secondary);
    expect(resolveSurfaceColor(theme, 'tertiary')).toBe(theme.semantics.accent);
    expect(resolveSurfaceColor(theme, 'quaternary')).toBe(theme.semantics.highlight);
    expect(resolveSurfaceColor(theme, 'neutral')).toBe(theme.semantics.action.neutral);
    expect(resolveSurfaceColor(theme, 'success')).toBe(theme.semantics.success);
    expect(resolveSurfaceColor(theme, 'warning')).toBe(theme.semantics.warning);
    expect(resolveSurfaceColor(theme, 'error')).toBe(theme.semantics.error);
    expect(resolveSurfaceColor(theme, 'info')).toBe(theme.semantics.info);
    expect(resolveSurfaceColor(theme, 'danger')).toBe(theme.semantics.action.danger);
  });
});
