import type { CircleLayoutOptions, NodeSingular } from 'cytoscape';

export const layout: CircleLayoutOptions = {
  name: 'circle',

  fit: true,
  avoidOverlap: true,

  // Sorts nodes alphabetically around the circle
  sort: (a: NodeSingular, b: NodeSingular) => a.data('id').localeCompare(b.data('id')),
};
