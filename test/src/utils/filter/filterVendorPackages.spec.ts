import { describe, expect, it } from '@artiphishle/testosterone';

import { filterVendorPackages } from '@/features/graph-view/utils/filterVendorPackages';
import type { ElementsDefinition } from 'cytoscape';

describe('[filterVendorPackages]', () => {
  it('keeps only intrinsic nodes and edges between intrinsic nodes', () => {
    const elements: ElementsDefinition = {
      nodes: [
        { data: { id: 'vendor.one' } },
        { data: { id: 'vendor.two' } },
        { data: { id: 'app.a', isIntrinsic: true } },
        { data: { id: 'app.b', isIntrinsic: true } },
      ],
      edges: [
        { data: { id: 'intrinsic', source: 'app.a', target: 'app.b', weight: 2 } },
        { data: { id: 'to-vendor', source: 'app.a', target: 'vendor.one', weight: 3 } },
        { data: { id: 'from-vendor', source: 'vendor.two', target: 'app.b', weight: 4 } },
      ],
    };

    const result = filterVendorPackages(elements);

    expect(result.nodes.map(node => node.data.id)).toEqual(['app.a', 'app.b']);
    expect(result.edges.length).toBe(1);
    expect(result.edges[0].data).toEqual({
      id: 'intrinsic',
      source: 'app.a',
      target: 'app.b',
      weight: 2,
    });
  });
});
