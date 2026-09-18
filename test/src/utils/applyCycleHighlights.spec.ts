import { describe, expect, it } from '@artiphishle/testosterone';
import cytoscape from 'cytoscape';

import type { GraphCycleHighlight } from '@/types/graphCycleHighlight';
import { applyCycleHighlights } from '@/utils/applyCycleHighlights';

describe('[applyCycleHighlights]', () => {
  it('emphasizes selected cycles, dims unrelated graph content, and labels directed steps', () => {
    const cy = cytoscape({
      headless: true,
      styleEnabled: true,
      elements: {
        nodes: [
          { data: { id: 'root' } },
          { data: { id: 'root.a', parent: 'root' } },
          { data: { id: 'root.b', parent: 'root' } },
          { data: { id: 'other' } },
        ],
        edges: [
          { data: { id: 'a-b', source: 'root.a', target: 'root.b' } },
          { data: { id: 'b-a', source: 'root.b', target: 'root.a' } },
          { data: { id: 'a-other', source: 'root.a', target: 'other' } },
        ],
      },
    });
    const highlight: GraphCycleHighlight = {
      id: 'cycle-1',
      color: '#d80303',
      nodeIds: ['root.a', 'root.b'],
      edges: [
        { source: 'root.a', step: 1, target: 'root.b' },
        { source: 'root.b', step: 2, target: 'root.a' },
      ],
    };

    applyCycleHighlights(cy, [highlight]);

    expect(Number(cy.getElementById('root.a').style('opacity'))).toBe(1);
    expect(Number(cy.getElementById('root').style('opacity'))).toBe(0.4);
    expect(Number(cy.getElementById('other').style('opacity'))).toBe(0.12);
    expect(cy.getElementById('a-b').style('label')).toBe('1');
    expect(Number(cy.getElementById('a-other').style('opacity'))).toBe(0.05);
  });
});
