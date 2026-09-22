import { useWindowDimensions } from 'react-native';

import { getBreakpointFromWidth } from './getBreakpointFromWidth';
import type { Breakpoint } from './types';

export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();
  return getBreakpointFromWidth(width);
}
