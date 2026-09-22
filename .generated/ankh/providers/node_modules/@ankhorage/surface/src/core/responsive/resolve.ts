import { BREAKPOINT_ORDER } from './breakpoints';
import type { Breakpoint, Responsive } from './types';

function isResponsiveRecord<T>(value: Responsive<T>): value is Partial<Record<Breakpoint, T>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function resolveResponsive<T>(
  value: Responsive<T> | undefined,
  breakpoint: Breakpoint,
): T | undefined {
  if (value === undefined) return undefined;
  if (!isResponsiveRecord(value)) return value;

  const activeIndex = BREAKPOINT_ORDER.indexOf(breakpoint);
  for (let i = activeIndex; i >= 0; i -= 1) {
    const key = BREAKPOINT_ORDER[i];
    if (!key) continue;
    const candidate = value[key];
    if (candidate !== undefined) return candidate;
  }

  return undefined;
}
