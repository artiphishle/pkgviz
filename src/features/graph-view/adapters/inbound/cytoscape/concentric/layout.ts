import type { ConcentricLayoutOptions, NodeSingular } from 'cytoscape';

export const layout: ConcentricLayoutOptions = {
  name: 'concentric',

  avoidOverlap: true,
  fit: true,
  padding: 30,
  sort: (a: NodeSingular, b: NodeSingular) => a.data('id').localeCompare(b.data('id')),
};
