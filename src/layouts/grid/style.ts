import type { StylesheetJson } from 'cytoscape';

export function getStyle() {
  const style: StylesheetJson = [
    {
      selector: 'node',
      style: {
        shape: 'rectangle', // Use sharp rectangles for a grid
      },
    },
    {
      selector: 'edge',
      style: {
        'curve-style': 'straight', // Straight lines are best for grids
        'text-margin-x': 0, // Reset text margins for straight lines
        'text-margin-y': 0,
      },
    },
  ];
  return style;
}
