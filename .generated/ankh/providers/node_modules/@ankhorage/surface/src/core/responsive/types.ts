import type { BREAKPOINTS } from './breakpoints';

export type Breakpoint = keyof typeof BREAKPOINTS;

export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

export interface ResponsiveRuntime {
  breakpoint: Breakpoint;
  width: number;
}
