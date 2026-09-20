import { describe, expect, it } from '@artiphishle/testosterone';

import cytoscape from 'cytoscape';

import { getStyle } from '@/layouts/style';

describe('[getStyle]', () => {
  it('keeps node dimensions stable across repeated style and highlight updates', () => {
    const elements = { nodes: [{ data: { id: 'a', name: 'a', label: 'package.a' } }], edges: [] };
    const cy = cytoscape({
      elements,
      headless: true,
      styleEnabled: true,
      style: getStyle(elements, 'light'),
    });
    try {
      const before = cy.getElementById('a').height();
      cy.style(getStyle(elements, 'dark')).update();
      cy.style(getStyle(elements, 'light')).update();
      expect(cy.getElementById('a').height()).toBe(before);
      expect(cy.getElementById('a').width()).toBe('package.a'.length * 7);
    } finally {
      cy.destroy();
    }
  });

  it('applies compound-safe endpoints while retaining bezier loop routing', () => {
    const elements = {
      nodes: [
        { data: { id: 'parent' } },
        { data: { id: 'child', parent: 'parent' } },
        { data: { id: 'peer' } },
      ],
      edges: [
        { data: { id: 'child-to-parent', source: 'child', target: 'parent', weight: 1 } },
        { data: { id: 'parent-to-child', source: 'parent', target: 'child', weight: 1 } },
        { data: { id: 'ordinary', source: 'child', target: 'peer', weight: 1 } },
        { data: { id: 'self-loop', source: 'child', target: 'child', weight: 1 } },
      ],
    };
    const cy = cytoscape({
      elements,
      headless: true,
      style: getStyle(elements, 'light'),
      styleEnabled: true,
    });

    try {
      for (const edgeId of ['child-to-parent', 'parent-to-child', 'ordinary']) {
        const edge = cy.getElementById(edgeId);
        expect(edge.style('source-endpoint')).toBe('outside-to-line');
        expect(edge.style('target-endpoint')).toBe('outside-to-line');
        expect(edge.style('curve-style')).toBe('bezier');
      }

      expect(cy.getElementById('self-loop').style('curve-style')).toBe('bezier');
    } finally {
      cy.destroy();
    }
  });

  it('renders active cycle edges above ordinary compound graph content', () => {
    const elements = {
      nodes: [{ data: { id: 'a' } }, { data: { id: 'b' } }],
      edges: [
        {
          classes: 'auditCycle',
          data: {
            id: 'cycle',
            source: 'a',
            target: 'b',
            weight: 1,
            auditCycleColor: '#dc2626',
            auditCycleStep: '1',
          },
        },
      ],
    };
    const cy = cytoscape({
      elements,
      headless: true,
      style: getStyle(elements, 'light'),
      styleEnabled: true,
    });

    try {
      const edge = cy.getElementById('cycle');
      expect(edge.style('z-compound-depth')).toBe('top');
      expect(edge.style('z-index-compare')).toBe('manual');
      expect(edge.style('z-index')).toBe('9999');
    } finally {
      cy.destroy();
    }
  });
});
