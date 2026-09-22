import type { SurfaceColor } from '../../types/surfaceColor';
import type { SurfaceTheme } from '../../types/theme';
import type { FieldState } from './resolveFieldState';
import type { InteractionState } from './resolveInteractiveState';
import { resolveSurfaceColor } from './resolveSurfaceColor';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'soft';

export interface ResolvedInteractiveColors {
  backgroundColor: string;
  borderColor: string;
  contentColor: string;
  opacity?: number;
}

export function resolveButtonColors(
  theme: SurfaceTheme,
  {
    variant,
    color,
    state,
  }: {
    variant: ButtonVariant;
    color: SurfaceColor;
    state: InteractionState;
  },
): ResolvedInteractiveColors {
  if (state.disabled) {
    return {
      backgroundColor: theme.semantics.surface.disabled,
      borderColor: theme.semantics.border.subtle,
      contentColor: theme.semantics.content.disabled,
    };
  }

  const semanticTone = resolveSurfaceColor(theme, color);

  switch (variant) {
    case 'outline':
      return {
        backgroundColor: state.pressed
          ? semanticTone.softActive
          : state.hovered
            ? semanticTone.softHover
            : 'transparent',
        borderColor: semanticTone.outline,
        contentColor: semanticTone.onSurfaceText,
      };
    case 'ghost':
      return {
        backgroundColor: state.pressed
          ? semanticTone.softActive
          : state.hovered
            ? semanticTone.softHover
            : 'transparent',
        borderColor: 'transparent',
        contentColor: semanticTone.onSurfaceText,
      };
    case 'soft':
      return {
        backgroundColor: state.pressed
          ? semanticTone.softActive
          : state.hovered
            ? semanticTone.softHover
            : semanticTone.softBg,
        borderColor: 'transparent',
        contentColor: state.pressed
          ? semanticTone.onSoftActiveText
          : state.hovered
            ? semanticTone.onSoftHoverText
            : semanticTone.onSoftText,
      };
    case 'solid':
    default:
      return {
        backgroundColor: state.pressed
          ? semanticTone.strong
          : state.hovered
            ? semanticTone.hover
            : semanticTone.base,
        borderColor: semanticTone.base,
        contentColor: state.pressed
          ? semanticTone.onStrongText
          : state.hovered
            ? semanticTone.onHoverText
            : semanticTone.onSolidText,
      };
  }
}

export function resolveInputColors(
  theme: SurfaceTheme,
  fieldState: FieldState,
): ResolvedInteractiveColors & { placeholderColor: string } {
  if (fieldState.disabled) {
    return {
      backgroundColor: theme.semantics.surface.disabled,
      borderColor: theme.semantics.border.subtle,
      contentColor: theme.semantics.content.disabled,
      placeholderColor: theme.semantics.content.disabled,
    };
  }

  if (fieldState.invalid) {
    return {
      backgroundColor: fieldState.readOnly
        ? theme.semantics.surface.subtle
        : theme.semantics.surface.default,
      borderColor: fieldState.focused ? theme.semantics.error.base : theme.semantics.error.outline,
      contentColor: theme.semantics.content.default,
      placeholderColor: theme.semantics.content.muted,
    };
  }

  if (fieldState.focused) {
    return {
      backgroundColor: theme.semantics.surface.default,
      borderColor: theme.semantics.border.focus,
      contentColor: theme.semantics.content.default,
      placeholderColor: theme.semantics.content.muted,
    };
  }

  if (fieldState.readOnly) {
    return {
      backgroundColor: theme.semantics.surface.subtle,
      borderColor: theme.semantics.border.default,
      contentColor: theme.semantics.content.default,
      placeholderColor: theme.semantics.content.muted,
    };
  }

  return {
    backgroundColor: theme.semantics.surface.default,
    borderColor: theme.semantics.border.default,
    contentColor: theme.semantics.content.default,
    placeholderColor: theme.semantics.content.muted,
  };
}
