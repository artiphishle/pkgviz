import type { ControlSize } from './resolveControlSize';

export interface ResolvedIndicatorSize {
  checkbox: number;
  checkboxIndicator: number;
  radio: number;
  radioDot: number;
  switchWidth: number;
  switchHeight: number;
  switchThumb: number;
}

export function resolveIndicatorSize(size: ControlSize = 'm'): ResolvedIndicatorSize {
  switch (size) {
    case 's':
      return {
        checkbox: 16,
        checkboxIndicator: 10,
        radio: 16,
        radioDot: 8,
        switchWidth: 30,
        switchHeight: 18,
        switchThumb: 12,
      };
    case 'l':
      return {
        checkbox: 22,
        checkboxIndicator: 14,
        radio: 22,
        radioDot: 10,
        switchWidth: 42,
        switchHeight: 26,
        switchThumb: 18,
      };
    case 'm':
    default:
      return {
        checkbox: 18,
        checkboxIndicator: 12,
        radio: 18,
        radioDot: 8,
        switchWidth: 34,
        switchHeight: 22,
        switchThumb: 14,
      };
  }
}
