import type { SurfaceColor, SurfaceEmphasis } from '../../types/surfaceColor';
import type { FieldState } from './resolveFieldState';

export interface ResolvedFieldPresentation {
  helperColor?: Extract<SurfaceColor, 'error'>;
  helperEmphasis: Extract<SurfaceEmphasis, 'default' | 'muted'>;
  labelColor?: Extract<SurfaceColor, 'error'>;
  labelEmphasis: Extract<SurfaceEmphasis, 'default' | 'muted'>;
}

export function resolveFieldPresentation(fieldState: FieldState): ResolvedFieldPresentation {
  if (fieldState.invalid) {
    return {
      helperColor: 'error',
      helperEmphasis: 'default',
      labelColor: 'error',
      labelEmphasis: 'default',
    };
  }

  if (fieldState.disabled || fieldState.readOnly) {
    return {
      helperEmphasis: 'muted',
      labelEmphasis: 'muted',
    };
  }

  return {
    helperEmphasis: 'default',
    labelEmphasis: 'default',
  };
}
