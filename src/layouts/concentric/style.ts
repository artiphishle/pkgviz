import type { /* NodeSingular, */ StylesheetJson } from 'cytoscape';

// No specific 'concentric' styles for now
export function getStyle() {
  const style: StylesheetJson = [
    {
      selector: 'node',
      style: {
        // label: 'data(name)',
        // width: (node: NodeSingular) => node.data('name').length * 7,
      },
    },
  ];

  return style;
}
