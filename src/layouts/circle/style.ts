import type { StylesheetJson } from 'cytoscape';

/*** Returns Cytoscape style overrides for this layout. */
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
