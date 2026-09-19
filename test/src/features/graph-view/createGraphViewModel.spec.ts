import { describe, expect, it } from '@artiphishle/testosterone';
import type { ElementsDefinition } from 'cytoscape';

import { createGraphViewModel } from '@/features/graph-view/adapters/inbound/react/createGraphViewModel';

describe('[createGraphViewModel]', () => {
  it('detaches only descendants whose dependency edge would overlap a compound ancestor', () => {
    const elements: ElementsDefinition = {
      nodes: [
        { data: { id: 'parent', name: 'parent' } },
        { data: { id: 'parent.child', name: 'child', parent: 'parent' } },
        { data: { id: 'parent.sibling', name: 'sibling', parent: 'parent' } },
      ],
      edges: [
        {
          data: {
            id: 'parent->parent.child',
            source: 'parent',
            target: 'parent.child',
            weight: 1,
          },
        },
      ],
    };

    const model = createGraphViewModel(elements, elements, []);
    const child = model.nodes.find(node => node.id === 'parent.child');
    const sibling = model.nodes.find(node => node.id === 'parent.sibling');

    expect(child?.parentId).toBeUndefined();
    expect(child?.data?.parent).toBeUndefined();
    expect(sibling?.parentId).toBe('parent');
    expect(model.edges.map(edge => edge.id)).toEqual(['parent->parent.child']);
  });

  it('drops parent references that point outside the visible projection', () => {
    const allElements: ElementsDefinition = {
      nodes: [
        { data: { id: 'parent', name: 'parent' } },
        { data: { id: 'parent.child', name: 'child', parent: 'parent' } },
      ],
      edges: [],
    };
    const visibleElements: ElementsDefinition = {
      nodes: [{ data: { id: 'parent.child', name: 'child', parent: 'parent' } }],
      edges: [],
    };

    const model = createGraphViewModel(allElements, visibleElements, []);

    expect(model.nodes[0]?.parentId).toBeUndefined();
    expect(model.nodes[0]?.data?.parent).toBeUndefined();
  });
});
