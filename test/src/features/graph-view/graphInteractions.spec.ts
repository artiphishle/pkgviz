import { describe, expect, it } from '@artiphishle/testosterone';

import { applyGraphInteractionPresentation } from '@/features/graph-view/adapters/inbound/react/applyGraphInteractionPresentation';
import { reduceGraphInteraction } from '@/features/graph-view/domain/reduceGraphInteraction';
import type { GraphInteractionState } from '@/types/graphInteraction';

const nodes = ['a', 'b', 'c', 'd'].map(id => ({
  id,
  classes: 'isVendor',
  data: { labelWidth: 7 },
}));
const edges = [
  {
    id: 'ab',
    source: 'a',
    target: 'b',
    classes: 'auditCycle',
    data: { auditCycleStep: '1', weight: 7 },
  },
  { id: 'ca', source: 'c', target: 'a' },
  { id: 'bd', source: 'b', target: 'd' },
];
const initial: GraphInteractionState = { hoveredNodeId: null, selectedNodeIds: [] };

describe('[graph interactions]', () => {
  it('highlights direct directed dependencies and preserves prepared model and audit data', () => {
    const state = reduceGraphInteraction(initial, { id: 'a', type: 'pointer-enter' });
    const result = applyGraphInteractionPresentation(nodes, edges, state);
    expect(result.nodes.map(node => node.classes)).toEqual([
      'isVendor highlight',
      'isVendor highlight-outgoer',
      'isVendor highlight-incomer',
      'isVendor hushed',
    ]);
    expect(result.edges.map(edge => edge.classes)).toEqual([
      'auditCycle highlight-outgoer',
      'highlight-incomer',
      'hushed',
    ]);
    expect(result.edges[0]?.data).toBe(edges[0]?.data);
    expect(result.nodes[0]?.data).toBe(nodes[0]?.data);
    expect(nodes[0]?.classes).toBe('isVendor');
    expect(edges[0]?.classes).toBe('auditCycle');
  });

  it('restores selection on pointer exit and clears presentation on deselection', () => {
    const selected = reduceGraphInteraction(initial, { id: 'a', type: 'select' });
    const hovered = reduceGraphInteraction(selected, { id: 'd', type: 'pointer-enter' });
    expect(applyGraphInteractionPresentation(nodes, edges, hovered).nodes[3]?.classes).toBe(
      'isVendor highlight'
    );
    const restored = reduceGraphInteraction(hovered, { id: 'd', type: 'pointer-leave' });
    expect(applyGraphInteractionPresentation(nodes, edges, restored)).toEqual(
      applyGraphInteractionPresentation(nodes, edges, selected)
    );
    const cleared = reduceGraphInteraction(restored, { id: 'a', type: 'unselect' });
    const result = applyGraphInteractionPresentation(nodes, edges, cleared);
    expect(result.nodes).toBe(nodes);
    expect(result.edges).toBe(edges);
  });

  it('ignores a late leave from a different node and duplicate selection events', () => {
    const selected = reduceGraphInteraction(initial, { id: 'a', type: 'select' });
    expect(reduceGraphInteraction(selected, { id: 'a', type: 'select' })).toBe(selected);
    const hovered = reduceGraphInteraction(selected, { id: 'b', type: 'pointer-enter' });
    expect(reduceGraphInteraction(hovered, { id: 'a', type: 'pointer-leave' })).toBe(hovered);
    expect(reduceGraphInteraction(hovered, { id: 'c', type: 'unselect' })).toBe(hovered);
  });

  it('combines multiple selections and retains self-loops and parallel edges', () => {
    const selected = reduceGraphInteraction(
      reduceGraphInteraction(initial, { id: 'a', type: 'select' }),
      { id: 'b', type: 'select' }
    );
    const result = applyGraphInteractionPresentation(
      nodes,
      [
        { source: 'a', target: 'b' },
        { source: 'a', target: 'b' },
        { source: 'a', target: 'a' },
      ],
      selected
    );
    expect(result.edges.map(edge => edge.classes)).toEqual([
      'highlight-outgoer highlight-incomer',
      'highlight-outgoer highlight-incomer',
      'highlight-outgoer highlight-incomer',
    ]);
  });
});
