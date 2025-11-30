import type { StylesheetJson } from 'cytoscape';

export function getStyle() {
  const style: StylesheetJson = [
    {
      selector: 'node',
      style: {
        'edge-distances': 'intersection', // 'node-position',
      },
    },
  ];

  return style;
}
