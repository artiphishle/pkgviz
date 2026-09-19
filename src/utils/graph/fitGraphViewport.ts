import type { Core } from 'cytoscape';

import { fitGraph } from '@/utils/graph/fitGraph';

/*** Fits a requested tree package or otherwise centers the complete graph. */
export function fitGraphViewport(cy: Core, revealPackageId?: string) {
  if (cy.destroyed()) return;
  if (revealPackageId && revealGraphPackage(cy, revealPackageId)) return;
  fitGraph(cy);
}

/*** Selects and fits one visible package node without changing the current graph projection. */
export function revealGraphPackage(cy: Core, packageId: string): boolean {
  if (!packageId || cy.destroyed()) return false;

  const node = cy.getElementById(packageId);
  if (node.empty()) return false;

  cy.nodes().unselect();
  node.select();
  cy.fit(node, 140);
  return true;
}
