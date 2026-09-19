import type { Core } from 'cytoscape';

/*** Fits and centers the complete graph using the canonical viewport padding. */
export function fitGraph(cy: Core, padding = 50) {
  if (cy.destroyed()) return;
  cy.fit(undefined, padding);
}
