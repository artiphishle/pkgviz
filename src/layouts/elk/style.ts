import type { StylesheetJson } from 'cytoscape';

export function getStyle() {
  const style: StylesheetJson = [
    {
      selector: 'node',
      style: {
        // 'edge-distances': 'node-position',
        'edge-distances': 'intersection',
      },
    },
  ];

  return style;
}
