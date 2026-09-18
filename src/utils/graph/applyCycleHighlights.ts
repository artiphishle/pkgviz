import type { Core } from 'cytoscape';

import type { CycleHighlight } from '@/types/auditVisualization';

/*** Applies selected audit-cycle metadata to existing Cytoscape nodes and directed edges. */
export function applyCycleHighlights(cy: Core, highlights: readonly CycleHighlight[]) {
  const allElements = cy.elements();
  allElements.removeClass('auditCycle');
  allElements.removeData('auditCycleColor');
  allElements.removeData('auditCycleStep');

  for (const highlight of highlights) {
    for (const packageName of new Set(highlight.cycle.packages)) {
      const node = cy.getElementById(packageName);
      if (node.empty()) continue;
      node.addClass('auditCycle');
      node.data('auditCycleColor', highlight.color);
    }

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

  return cy.elements('.auditCycle');
}
