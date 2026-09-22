import type {
  SURFACE_COLORS,
  SURFACE_EMPHASES,
  SURFACE_PALETTE_COLORS,
  SURFACE_STATUS_COLORS,
} from '../constants/surfaceColor';

export type SurfacePaletteColor = (typeof SURFACE_PALETTE_COLORS)[number];
export type SurfaceStatusColor = (typeof SURFACE_STATUS_COLORS)[number];
export type SurfaceColor = (typeof SURFACE_COLORS)[number];
export type SurfaceEmphasis = (typeof SURFACE_EMPHASES)[number];
