import { GridLayoutOptions, NodeSingular } from 'cytoscape';

export const layout: GridLayoutOptions = {
  name: 'grid',
  fit: true,
  padding: 30, // Add some space around the graph
  avoidOverlap: true,

  // Sort nodes alphabetically by their ID
  sort: (a: NodeSingular, b: NodeSingular) => a.data('id').localeCompare(b.data('id')),
};
