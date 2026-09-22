import type { SurfaceTheme } from '../../types/theme';
import { type ControlSize, resolveControlSize } from './resolveControlSize';

export function resolveIconSize(theme: SurfaceTheme, size: ControlSize = 'm'): number {
  return resolveControlSize(theme, size).iconSize;
}
