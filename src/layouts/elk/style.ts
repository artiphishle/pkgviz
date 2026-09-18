import type { StylesheetJson } from 'cytoscape';

/*** Returns Cytoscape style overrides for this layout. */
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
