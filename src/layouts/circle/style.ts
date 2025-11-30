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
      style: {},
    },
  ];
  return styles;
}
