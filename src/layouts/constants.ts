import type { LayoutOptions } from 'cytoscape';

import {
  breadthfirstLayout,
  circleLayout,
  concentricLayout,
  elkLayout,
  gridLayout,
  klayLayout,
} from '@/layouts/index';

export const LAYOUTS: Record<LayoutOptions['name'], LayoutOptions> = {
  breadthfirst: breadthfirstLayout,
  circle: circleLayout,
  concentric: concentricLayout,
  elk: elkLayout,
  grid: gridLayout,
  klay: klayLayout,
} as const;
