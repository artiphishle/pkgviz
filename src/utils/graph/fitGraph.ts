import type { Core } from 'cytoscape';

/*** Fits and centers the graph from node bounds so invalid edges cannot distort the viewport. */
export function fitGraph(cy: Core, padding = 50) {
  if (cy.destroyed()) return;
  const nodes = cy.nodes();
  if (nodes.empty()) return;
  cy.fit(nodes, padding);
}
