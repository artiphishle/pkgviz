import type { SurfaceColor } from '../../types/surfaceColor';
import type { RoleSemantics, SurfaceTheme } from '../../types/theme';

export function resolveSurfaceColor(
  theme: SurfaceTheme,
  color: SurfaceColor = 'primary',
): RoleSemantics {
  switch (color) {
    case 'secondary':
      return theme.semantics.secondary;
    case 'tertiary':
      return theme.semantics.accent;
    case 'quaternary':
      return theme.semantics.highlight;
    case 'neutral':
      return theme.semantics.action.neutral;
    case 'error':
      return theme.semantics.error;
    case 'info':
      return theme.semantics.info;
    case 'danger':
      return theme.semantics.action.danger;
    case 'success':
      return theme.semantics.success;
    case 'warning':
      return theme.semantics.warning;
    case 'primary':
    default:
      return theme.semantics.action.primary;
  }
}
