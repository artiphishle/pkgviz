import type { StylesheetJson } from 'cytoscape';

export function getStyle() {
  const style: StylesheetJson = [
    {
      selector: 'node',
      style: {
        shape: 'rectangle',
      },
    },
    {
      selector: 'edge',
      style: {
        'text-margin-x': 0, // Reset text margins for straight lines
        'text-margin-y': 0,
      },
    },
  ];
  return style;
}
