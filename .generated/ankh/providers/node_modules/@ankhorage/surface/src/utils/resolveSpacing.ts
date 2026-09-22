import { resolveToken } from '../features/theme/utils/resolveToken';
import type { SpaceValue } from '../types/layout';
import type { SurfaceTheme } from '../types/theme';

/*** Resolves a numeric spacing value or a Surface spacing token. */
export function resolveSpacing(
  theme: SurfaceTheme,
  value: SpaceValue | undefined,
): number | undefined {
  return resolveToken(theme.spacing, value);
}
