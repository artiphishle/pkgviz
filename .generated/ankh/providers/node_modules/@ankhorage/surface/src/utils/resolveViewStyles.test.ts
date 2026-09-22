import { describe, expect, test } from 'bun:test';

import type { SurfaceTheme } from '../types/theme';
import { resolveViewStyles } from './resolveViewStyles';

const mockTheme = {
  spacing: { s: 4, m: 8, l: 16 },
  radii: { m: 8 },
  colors: { primary: '#007AFF', surface: '#FFFFFF' },
} as unknown as SurfaceTheme;

describe('resolveViewStyles spacing and responsive layout', () => {
  test('resolves padding and margins correctly', () => {
    const styles = resolveViewStyles(mockTheme, 'base', { p: 's', m: 8 });
    expect(styles.padding).toBe(4);
    expect(styles.margin).toBe(8);
  });

  test('resolves responsive properties', () => {
    const props = { p: { base: 's', lg: 'l' }, direction: { base: 'column', lg: 'row' } } as const;
    expect(resolveViewStyles(mockTheme, 'base', props).padding).toBe(4);
    expect(resolveViewStyles(mockTheme, 'base', props).flexDirection).toBe('column');
    expect(resolveViewStyles(mockTheme, 'lg', props).padding).toBe(16);
    expect(resolveViewStyles(mockTheme, 'lg', props).flexDirection).toBe('row');
  });

  test('resolves gap tokens with native flex layout props', () => {
    const styles = resolveViewStyles(mockTheme, 'base', {
      align: 'center',
      gap: 'm',
      justify: 'space-between',
      wrap: 'wrap',
    });
    expect(styles.alignItems).toBe('center');
    expect(styles.gap).toBe(8);
    expect(styles.justifyContent).toBe('space-between');
    expect(styles.flexWrap).toBe('wrap');
  });
});

describe('resolveViewStyles visual and dimension styles', () => {
  test('resolves colors and border styles', () => {
    const styles = resolveViewStyles(mockTheme, 'base', {
      bg: 'primary',
      radius: 'm',
      borderWidth: 1,
      borderColor: 'surface',
    });
    expect(styles.backgroundColor).toBe('#007AFF');
    expect(styles.borderRadius).toBe(8);
    expect(styles.borderWidth).toBe(1);
    expect(styles.borderColor).toBe('#FFFFFF');
  });

  test('resolves spacing tokens for dimension props and preserves raw strings', () => {
    const styles = resolveViewStyles(mockTheme, 'base', {
      width: 'm',
      minHeight: 'l',
      maxWidth: '50%',
    });
    expect(styles.width).toBe(8);
    expect(styles.minHeight).toBe(16);
    expect(styles.maxWidth).toBe('50%');
  });

  test('handles undefined props gracefully', () => {
    const styles = resolveViewStyles(mockTheme, 'base', {});
    expect(styles.padding).toBeUndefined();
    expect(styles.margin).toBeUndefined();
  });
});
