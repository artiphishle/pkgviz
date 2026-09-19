import type { Core } from 'cytoscape';

import type { CycleHighlight } from '@/types/auditVisualization';

/*** Applies selected audit-cycle emphasis without changing graph scope, layout, or viewport. */
export function applyCycleHighlights(cy: Core, highlights: readonly CycleHighlight[]) {
  const allElements = cy.elements();
  allElements.removeClass('auditCycle');
  allElements.removeData('auditCycleColor');
  allElements.removeData('auditCycleStep');

  if (highlights.length === 0) return cy.collection();

  for (const highlight of highlights) {
    emphasizeCycleNodes(cy, highlight);
    emphasizeCycleEdges(cy, highlight);
  }

  return cy.elements('.auditCycle');
}

/*** Emphasizes cycle nodes while retaining their compound ancestors as visual context. */
function emphasizeCycleNodes(cy: Core, highlight: CycleHighlight) {
  for (const packageName of new Set(highlight.cycle.packages)) {
    const node = cy.getElementById(packageName);
    if (node.empty()) continue;

    node.addClass('auditCycle');
    node.data('auditCycleColor', highlight.color);
  }
}

/*** Emphasizes the directed dependency edges that belong to one selected cycle. */
function emphasizeCycleEdges(cy: Core, highlight: CycleHighlight) {
  highlight.cycle.edges.forEach((cycleEdge, index) => {
    cy.edges()
      .filter(edge => edge.source().id() === cycleEdge.from && edge.target().id() === cycleEdge.to)
      .forEach(edge => {
        edge.addClass('auditCycle');
        edge.data('auditCycleColor', highlight.color);
        edge.data('auditCycleStep', String(index + 1));
      });
  });
}
