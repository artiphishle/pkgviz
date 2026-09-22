import { describe, expect, it } from 'bun:test';

import { createTheme } from '../../theme/application/use-cases/createTheme';
import { resolveHeadingTextStyle } from './resolveHeadingTextStyle';

describe('resolveHeadingTextStyle', () => {
  it('maps heading levels to theme-driven typography tokens', () => {
    const theme = createTheme();
    const style = resolveHeadingTextStyle(theme, 4, 'center');
    expect(style.fontSize).toBe(18);
    expect(style.lineHeight).toBe(24);
    expect(style.fontWeight).toBe('600');
    expect(style.color).toBe(theme.colors.text);
    expect(style.textAlign).toBe('center');
  });
  it('uses the themed font family when one is configured', () => {
    const style = resolveHeadingTextStyle(createTheme(undefined, 'light', 'space grotesk'), 1);
    expect(style.fontFamily).toBe('SpaceGrotesk_700Regular');
  });
  it('shares the default content emphasis with Text', () => {
    const theme = createTheme();
    expect(resolveHeadingTextStyle(theme, 2).color).toBe(theme.semantics.content.default);
  });
});
