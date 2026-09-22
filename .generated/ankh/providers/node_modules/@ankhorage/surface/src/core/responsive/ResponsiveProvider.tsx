import React, { createContext, use, useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import { getBreakpointFromWidth } from './getBreakpointFromWidth';
import type { ResponsiveRuntime } from './types';

const ResponsiveContext = createContext<ResponsiveRuntime | null>(null);

export function ResponsiveProvider({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();

  const value = useMemo<ResponsiveRuntime>(
    () => ({
      breakpoint: getBreakpointFromWidth(width),
      width,
    }),
    [width],
  );

  return <ResponsiveContext value={value}>{children}</ResponsiveContext>;
}

export function useResponsiveRuntime(): ResponsiveRuntime {
  const runtime = use(ResponsiveContext);

  if (!runtime) {
    throw new Error('useResponsiveRuntime must be used within a ResponsiveProvider');
  }

  return runtime;
}
