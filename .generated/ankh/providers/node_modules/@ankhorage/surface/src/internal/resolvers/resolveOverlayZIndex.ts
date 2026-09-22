export type OverlayLayer = 'modal' | 'drawer' | 'menu' | 'popover' | 'tooltip' | 'toast';

const BASE_Z_INDEX: Record<OverlayLayer, number> = {
  modal: 1000,
  drawer: 1100,
  menu: 1200,
  popover: 1250,
  tooltip: 1300,
  toast: 1400,
};

export function resolveOverlayZIndex(layer: OverlayLayer, stackIndex = 0): number {
  return BASE_Z_INDEX[layer] + stackIndex;
}
