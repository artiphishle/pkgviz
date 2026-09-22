import { describe, expect, it } from 'bun:test';

import { createTheme } from '../../features/theme/application/use-cases/createTheme';
import { resolveFieldState } from './resolveFieldState';
import { resolveButtonColors, resolveInputColors } from './resolveInteractiveColors';

describe('resolveInteractiveColors', () => {
  it('maps button variant, color, and state through semantic slots', () => {
    const theme = createTheme();
    const solid = resolveButtonColors(theme, {
      variant: 'solid',
      color: 'primary',
      state: {
        disabled: false,
        focused: false,
        hovered: false,
        pressed: false,
      },
    });
    const outline = resolveButtonColors(theme, {
      variant: 'outline',
      color: 'danger',
      state: {
        disabled: false,
        focused: false,
        hovered: true,
        pressed: false,
      },
    });

    expect(solid.backgroundColor).toBe(theme.semantics.action.primary.base);
    expect(solid.contentColor).toBe(theme.semantics.action.primary.onSolidText);
    expect(outline.borderColor).toBe(theme.semantics.action.danger.outline);
    expect(outline.backgroundColor).toBe(theme.semantics.action.danger.softHover);
    expect(outline.contentColor).toBe(theme.semantics.action.danger.onSurfaceText);
  });

  it('derives input colors from interaction and validation state', () => {
    const theme = createTheme();
    const focusedInvalid = resolveInputColors(
      theme,
      resolveFieldState({
        focused: true,
        invalid: true,
      }),
    );
    const readOnly = resolveInputColors(
      theme,
      resolveFieldState({
        readOnly: true,
      }),
    );

    expect(focusedInvalid.borderColor).toBe(theme.semantics.error.base);
    expect(readOnly.backgroundColor).toBe(theme.semantics.surface.subtle);
    expect(readOnly.placeholderColor).toBe(theme.semantics.content.muted);
  });
});
