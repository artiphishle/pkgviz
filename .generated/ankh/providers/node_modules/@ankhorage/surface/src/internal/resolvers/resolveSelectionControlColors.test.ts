import { describe, expect, it } from 'bun:test';

import { createTheme } from '../../features/theme/application/use-cases/createTheme';
import { resolveFieldState } from './resolveFieldState';
import { resolveSelectionControlColors } from './resolveSelectionControlColors';

describe('resolveSelectionControlColors', () => {
  it('maps checked controls through the selected color semantics', () => {
    const theme = createTheme();
    const colors = resolveSelectionControlColors(theme, {
      checked: true,
      fieldState: resolveFieldState({ focused: true }),
      color: 'primary',
    });

    expect(colors.borderColor).toBe(theme.semantics.action.primary.base);
    expect(colors.indicatorColor).toBe(theme.semantics.action.primary.onSolidText);
    expect(colors.labelColor).toBe(theme.semantics.content.default);
  });

  it('maps invalid unchecked controls through error/border semantics', () => {
    const theme = createTheme();
    const colors = resolveSelectionControlColors(theme, {
      checked: false,
      fieldState: resolveFieldState({ invalid: true }),
      color: 'primary',
    });

    expect(colors.borderColor).toBe(theme.semantics.error.outline);
    expect(colors.trackColor).toBe(theme.semantics.error.outline);
  });

  it('mutes disabled controls regardless of color', () => {
    const theme = createTheme();
    const colors = resolveSelectionControlColors(theme, {
      checked: true,
      fieldState: resolveFieldState({ disabled: true }),
      color: 'danger',
    });

    expect(colors.backgroundColor).toBe(theme.semantics.surface.disabled);
    expect(colors.labelColor).toBe(theme.semantics.content.disabled);
    expect(colors.opacity).toBeUndefined();
  });
});
