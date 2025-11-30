import type { LayoutOptions } from 'cytoscape';

import {
  breadthfirstLayout,
  circleLayout,
  concentricLayout,
  elkLayout,
  gridLayout,
} from '@/layouts/index';

export const LAYOUTS: Record<LayoutOptions['name'], LayoutOptions> = {
  breadthfirst: breadthfirstLayout,
  circle: circleLayout,
  concentric: concentricLayout,
  elk: elkLayout,
  grid: gridLayout,
} as const;
