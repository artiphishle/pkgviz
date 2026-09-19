import type { Core } from 'cytoscape';

/*** Fits active cycle diagnostics, a requested package, or the complete graph in priority order. */
export function fitGraphViewport(cy: Core, revealPackageId?: string) {
  if (cy.destroyed()) return;

  const cycleElements = cy.elements('.auditCycle');
  if (!cycleElements.empty()) {
    cy.fit(cycleElements, 80);
    return;
  }

  if (revealPackageId && revealGraphPackage(cy, revealPackageId)) return;
  cy.fit(undefined, 50);
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
