import { BREAKPOINT_ORDER, BREAKPOINTS } from './breakpoints';
import type { Breakpoint } from './types';

export function getBreakpointFromWidth(width: number): Breakpoint {
  let active: Breakpoint = 'base';
  for (const key of BREAKPOINT_ORDER) {
    if (width >= BREAKPOINTS[key]) active = key;
  }
  return active;
}
