export const SURFACE_PALETTE_COLORS = [
  'primary',
  'secondary',
  'tertiary',
  'quaternary',
  'neutral',
] as const;

export const SURFACE_STATUS_COLORS = ['success', 'warning', 'error', 'info'] as const;

export const SURFACE_COLORS = [
  ...SURFACE_PALETTE_COLORS,
  ...SURFACE_STATUS_COLORS,
  'danger',
] as const;

export const SURFACE_EMPHASES = ['default', 'muted', 'subtle', 'inverse'] as const;
