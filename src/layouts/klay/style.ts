import type { StylesheetJson } from 'cytoscape';

// No specific 'klay' styles for now
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
