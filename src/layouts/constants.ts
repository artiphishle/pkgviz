import type { LayoutOptions } from 'cytoscape';

import {
  breadthfirstLayout,
  circleLayout,
  concentricLayout,
  elkLayout,
  gridLayout,
  umlLayout,
} from '@/layouts';

export const LAYOUTS: Record<LayoutOptions['name'], LayoutOptions> = {
  breadthfirst: breadthfirstLayout,
  circle: circleLayout,
  concentric: concentricLayout,
  elk: elkLayout,
  grid: gridLayout,
  uml: umlLayout,
} as const;
