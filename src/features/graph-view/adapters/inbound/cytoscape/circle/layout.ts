import type { CircleLayoutOptions, NodeSingular } from 'cytoscape';

export const layout: CircleLayoutOptions = {
  name: 'circle',

  fit: true,
  avoidOverlap: true,

  // Sorts nodes alphabetically around the circle using Cytoscape's typed identity API.
  sort: (a: NodeSingular, b: NodeSingular) => a.id().localeCompare(b.id()),
};
