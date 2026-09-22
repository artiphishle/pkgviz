import type { LayoutOptions } from 'cytoscape';

import { layout as breadthfirstLayout } from '@/features/graph-view/adapters/inbound/cytoscape/breadthfirst/layout';
import { layout as circleLayout } from '@/features/graph-view/adapters/inbound/cytoscape/circle/layout';
import { layout as concentricLayout } from '@/features/graph-view/adapters/inbound/cytoscape/concentric/layout';
import { layout as elkLayout } from '@/features/graph-view/adapters/inbound/cytoscape/elk/layout';
import { layout as gridLayout } from '@/features/graph-view/adapters/inbound/cytoscape/grid/layout';

export const LAYOUTS: Record<LayoutOptions['name'], LayoutOptions> = {
  breadthfirst: breadthfirstLayout,
  circle: circleLayout,
  concentric: concentricLayout,
  elk: elkLayout,
  grid: gridLayout,
} as const;
