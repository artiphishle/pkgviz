import { describe, expect, it } from '@artiphishle/testosterone';

import cytoscape, { type ElementsDefinition } from 'cytoscape';

import { createGraphViewModel } from '@/features/graph-view/adapters/inbound/react/createGraphViewModel';
import { getStyle } from '@/features/graph-view/adapters/inbound/cytoscape/style';

describe('[getStyle]', () => {
  it('marks cycle compounds without coloring their entire underlay in either theme', () => {
    const elements = {
      nodes: [
        { data: { id: 'p', auditCycleColor: '#dc2626' }, classes: 'auditCycle' },
        { data: { id: 'p.c', parent: 'p' } },
      ],
      edges: [],
    };
    for (const theme of ['light', 'dark'] as const) {
      const cy = cytoscape({
        elements: toRenderableElements(elements),
        headless: true,
        styleEnabled: true,
        style: getStyle(elements, theme),
      });
      try {
        const parent = cy.getElementById('p');
        for (const selected of [false, true]) {
          if (selected) parent.select();
          expect(parent.style('underlay-opacity')).toBe('0');
          expect(parent.style('border-color')).toBe('rgb(220,38,38)');
          expect(Number(parent.style('background-opacity')) < 0.18).toBe(true);
        }
      } finally {
        cy.destroy();
      }
    }
  });
  it('keeps nested compound fills visible and bounded while reserving real node padding', () => {
    const elements = {
      nodes: [
        { data: { id: 'p' } },
        { data: { id: 'p.c', parent: 'p' } },
        { data: { id: 'p.c.leaf', parent: 'p.c' } },
      ],
      edges: [],
    };
    const cy = cytoscape({
      elements: toRenderableElements(elements),
      headless: true,
      styleEnabled: true,
      style: getStyle(elements, 'light'),
    });
    try {
      const outer = Number(cy.getElementById('p').style('background-opacity'));
      const inner = Number(cy.getElementById('p.c').style('background-opacity'));
      expect(outer > 0).toBe(true);
      expect(1 - (1 - outer) * (1 - inner) > outer).toBe(true);
      expect(1 - (1 - outer) * (1 - inner) < 0.18).toBe(true);
      expect(cy.getElementById('p.c.leaf').style('padding')).toBe('12px');
    } finally {
      cy.destroy();
    }
  });

  it('keeps selection and hover paint changes out of layout geometry', () => {
    const elements = { nodes: [{ data: { id: 'a', label: 'package.a' } }], edges: [] };
    const cy = cytoscape({
      elements: toRenderableElements(elements),
      headless: true,
      styleEnabled: true,
      style: getStyle(elements, 'light'),
    });
    try {
      const node = cy.getElementById('a');
      const before = node.layoutDimensions({ nodeDimensionsIncludeLabels: true });
      node.addClass('highlight');
      expect(node.style('background-color')).toBe('rgb(11,95,255)');
      expect(node.layoutDimensions({ nodeDimensionsIncludeLabels: true })).toEqual(before);
      node.select();
      expect(node.style('outline-width')).toBe('2px');
      expect(node.layoutDimensions({ nodeDimensionsIncludeLabels: true })).toEqual(before);
      node.removeClass('highlight');
      node.unselect();
      node.addClass('hushed');
      expect(node.style('opacity')).toBe('0.2');
      expect(node.layoutDimensions({ nodeDimensionsIncludeLabels: true })).toEqual(before);
    } finally {
      cy.destroy();
    }
  });

  it('keeps node dimensions stable across repeated style and highlight updates', () => {
    const elements = { nodes: [{ data: { id: 'a', name: 'a', label: 'package.a' } }], edges: [] };
    const cy = cytoscape({
      elements: toRenderableElements(elements),
      headless: true,
      styleEnabled: true,
      style: getStyle(elements, 'light'),
    });
    try {
      const before = cy.getElementById('a').height();
      cy.style(getStyle(elements, 'dark')).update();
      cy.style(getStyle(elements, 'light')).update();
      expect(cy.getElementById('a').height()).toBe(before);
      expect(cy.getElementById('a').width()).toBe(24);
      expect(cy.getElementById('a').style('label')).toBe('package.a');
      cy.getElementById('a').data({ label: 'renamed' });
      expect(cy.getElementById('a').style('label')).toBe('renamed');
      expect(cy.getElementById('a').width()).toBe(24);
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
      elements: toRenderableElements(elements),
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
      elements: toRenderableElements(elements),
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

function toRenderableElements(elements: ElementsDefinition): ElementsDefinition {
  const model = createGraphViewModel(elements, elements, []);
  return {
    nodes: model.nodes.map(node => ({
      classes: node.classes,
      data: { ...node.data, id: node.id, label: node.label, parent: node.parentId },
    })),
    edges: model.edges.map(edge => ({
      classes: edge.classes,
      data: { ...edge.data, id: edge.id, source: edge.source, target: edge.target },
    })),
  };
}
