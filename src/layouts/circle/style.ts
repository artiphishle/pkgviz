import type { StylesheetJson } from 'cytoscape';

export function getStyle() {
  const styles: StylesheetJson = [
    {
      selector: 'node',
      style: {
        // Ellipses or circles complement the layout
        shape: 'barrel',
      },
    },
    {
      selector: 'edge',
      style: {
        // Bezier curves work well to avoid overlaps
        'curve-style': 'bezier',
      },
    },
  ];
  return styles;
}
