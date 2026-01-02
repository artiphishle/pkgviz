import type { StylesheetJson } from 'cytoscape';

export function getStyle() {
  const style: StylesheetJson = [
    {
      selector: 'node',
      style: {},
    },
    {
      selector: 'edge',
      style: {},
    },
  ];
  return style;
}
