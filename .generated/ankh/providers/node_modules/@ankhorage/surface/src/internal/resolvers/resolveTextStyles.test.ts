import { describe, expect, it } from 'bun:test';

import { createTheme } from '../../features/theme/application/use-cases/createTheme';
import { resolveTextStyles } from './resolveTextStyles';

describe('resolveTextStyles', () => {
  it('maps body and label variants to theme-driven typography', () => {
    const theme = createTheme();

    const body = resolveTextStyles(theme, { variant: 'body' });
    const label = resolveTextStyles(theme, { variant: 'label' });

    expect(body.fontSize).toBe(theme.typography.sizes.m);
    expect(body.lineHeight).toBe(24);
    expect(label.fontSize).toBe(theme.typography.sizes.s);
    expect(label.fontWeight).toBe(theme.typography.weights.medium);
  });

  it('resolves heading levels through the shared text resolver', () => {
    const theme = createTheme(undefined, 'light', 'space grotesk');
    const style = resolveTextStyles(theme, { level: 1 });

    expect(style.fontSize).toBe(theme.typography.headings[1].size);
    expect(style.fontWeight).toBe(theme.typography.weights.bold);
    expect(style.fontFamily).toBe('SpaceGrotesk_700Regular');
  });
});
