import type { CircleLayoutOptions, NodeSingular } from 'cytoscape';

export const layout: CircleLayoutOptions = {
  name: 'circle',

  fit: true,
  avoidOverlap: true,

  // Sorts nodes alphabetically around the circle
  sort: (a: NodeSingular, b: NodeSingular) => String(a.data('id')).localeCompare(String(b.data('id'))),
};
