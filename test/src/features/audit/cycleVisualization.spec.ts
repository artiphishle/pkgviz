import { describe, expect, it } from '@artiphishle/testosterone';

import cytoscape from 'cytoscape';

import { getCycleColor } from '@/features/audit/utils/cycleVisualization';
import { getStyle } from '@/layouts/style';
import type { PackageCycleDetail } from '@/types/audit';
import { applyCycleHighlights } from '@/utils/graph/applyCycleHighlights';

describe('[cycleVisualization]', () => {
  it('uses cycle colors that Cytoscape renders consistently across graph elements', () => {
    const cycle: PackageCycleDetail = {
      packages: ['app.a', 'app.b', 'app.a'],
      edges: [
        { from: 'app.a', to: 'app.b', via: [] },
        { from: 'app.b', to: 'app.a', via: [] },
      ],
    };
    const elements = {
      nodes: [
        { data: { id: 'app.a', name: 'app.a' } },
        { data: { id: 'app.b', name: 'app.b' } },
      ],
      edges: [
        { data: { id: 'a-to-b', source: 'app.a', target: 'app.b', weight: 1 } },
        { data: { id: 'b-to-a', source: 'app.b', target: 'app.a', weight: 1 } },
      ],
    };
    const cy = cytoscape({
      elements,
      headless: true,
      style: getStyle(elements, 'light'),
      styleEnabled: true,
    });

    try {
      applyCycleHighlights(cy, [
        {
          id: 'cycle-2',
          color: getCycleColor(1),
          cycle,
        },
      ]);

      expect(cy.getElementById('app.a').style('border-color')).toBe(
        cy.getElementById('a-to-b').style('line-color')
      );
    } finally {
      cy.destroy();
    }
  });
});
