import type { GridLayoutOptions, NodeSingular } from 'cytoscape';

export const layout: GridLayoutOptions = {
  name: 'grid',
  // fit: true,
  // padding: 30, // Add some space around the graph
  avoidOverlap: true,

  // Sort nodes alphabetically by their Cytoscape identity.
  sort: (a: NodeSingular, b: NodeSingular) => a.id().localeCompare(b.id()),
};
