import { describe, expect, it } from '@artiphishle/testosterone';

import cytoscape from 'cytoscape';

import { applyCycleHighlights } from '@/utils/graph/applyCycleHighlights';

describe('[applyCycleHighlights]', () => {
  it('adds cycle emphasis without muting unrelated graph elements', () => {
    const cy = cytoscape({
      elements: [
        { data: { id: 'app.a' } },
        { data: { id: 'app.b' } },
        { data: { id: 'app.c' } },
        { data: { id: 'a-b', source: 'app.a', target: 'app.b' } },
        { data: { id: 'b-c', source: 'app.b', target: 'app.c' } },
      ],
      headless: true,
    });

    try {
      applyCycleHighlights(cy, [
        {
          id: 'cycle',
          color: '#dc2626',
          cycle: {
            packages: ['app.a', 'app.b', 'app.a'],
            edges: [
              { from: 'app.a', to: 'app.b', via: [] },
              { from: 'app.b', to: 'app.a', via: [] },
            ],
          },
        },
      ]);

      expect(cy.getElementById('app.a').hasClass('auditCycle')).toBe(true);
      expect(cy.getElementById('a-b').hasClass('auditCycle')).toBe(true);
      expect(cy.getElementById('app.c').hasClass('auditCycleMuted')).toBe(false);
      expect(cy.getElementById('b-c').hasClass('auditCycleMuted')).toBe(false);
    } finally {
      cy.destroy();
    }
  });
});
