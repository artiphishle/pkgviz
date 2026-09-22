import { describe, expect, it } from 'bun:test';

import { createTheme } from '../../features/theme/application/use-cases/createTheme';
import { resolveControlSize } from './resolveControlSize';

describe('resolveControlSize', () => {
  it('returns a fixed control shape for each size', () => {
    const theme = createTheme();
    const small = resolveControlSize(theme, 's');
    const medium = resolveControlSize(theme, 'm');
    const large = resolveControlSize(theme, 'l');

    expect(small).toEqual({
      minHeight: 32,
      paddingHorizontal: theme.spacing.s,
      paddingVertical: 6,
      borderRadius: theme.radii.m,
      textVariant: 'bodySmall',
      iconSize: 16,
    });
    expect(medium.minHeight).toBe(40);
    expect(large.minHeight).toBe(48);
    expect(large.iconSize).toBe(20);
  });
});
