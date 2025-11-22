import type { LayoutOptions } from 'cytoscape';

import { getStyle as getBreadthfirstStyle } from '@/layouts/breadthfirst/style';
import { getStyle as getCircleStyle } from '@/layouts/circle/style';
import { getStyle as getConcentricStyle } from '@/layouts/concentric/style';
import { getStyle as getGridStyle } from '@/layouts/grid/style';
import { getStyle as getKlayStyle } from '@/layouts/klay/style';

export function getLayoutStyle(cytoscapeLayout: LayoutOptions['name']) {
  switch (cytoscapeLayout) {
    case 'breadthfirst':
      return getBreadthfirstStyle();
    case 'circle':
      return getCircleStyle();
    case 'concentric':
      return getConcentricStyle();
    case 'grid':
      return getGridStyle();
    case 'klay':
      return getKlayStyle();
  }
}
