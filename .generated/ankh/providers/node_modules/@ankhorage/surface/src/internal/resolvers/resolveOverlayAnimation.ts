import type { OverlayLayer } from './resolveOverlayZIndex';

export interface OverlayAnimationValues {
  enterDuration: number;
  exitDuration: number;
  backdropOpacity: number;
  offset: number;
}

export function resolveOverlayAnimation(layer: OverlayLayer): OverlayAnimationValues {
  switch (layer) {
    case 'drawer':
      return { enterDuration: 180, exitDuration: 140, backdropOpacity: 0.26, offset: 24 };
    case 'tooltip':
      return { enterDuration: 90, exitDuration: 90, backdropOpacity: 0, offset: 8 };
    case 'toast':
      return { enterDuration: 140, exitDuration: 120, backdropOpacity: 0, offset: 12 };
    case 'menu':
      return { enterDuration: 110, exitDuration: 110, backdropOpacity: 0.04, offset: 6 };
    case 'modal':
    default:
      return { enterDuration: 160, exitDuration: 140, backdropOpacity: 0.32, offset: 12 };
  }
}
