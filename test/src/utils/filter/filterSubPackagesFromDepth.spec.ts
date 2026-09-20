import { describe, expect, it } from '@artiphishle/testosterone';

import {
  filterSubPackagesByDepth,
  getMaxDepth,
  getMaxDepthByRoot,
} from '@/utils/filter/filterSubPackagesFromDepth';
import type { ElementsDefinition } from 'cytoscape';

describe('[filterSubPackagesByDepth]', () => {
  it('reports depth globally and per root', () => {
    const elements = createElements();

    expect(getMaxDepth(elements)).toBe(3);
    expect(getMaxDepthByRoot(elements)).toEqual({
      app: 3,
      vendor: 2,
    });
  });

  it('lifts and aggregates edges at the selected depth', () => {
    const result = filterSubPackagesByDepth(createElements(), false, 2);

    expect(result.nodes.map(node => node.data.id)).toEqual([
      'app',
      'app.feature',
      'app.shared',
      'vendor',
      'vendor.lib',
    ]);

    const featureToShared = result.edges.find(
      edge => edge.data.source === 'app.feature' && edge.data.target === 'app.shared'
    );
    const featureToVendor = result.edges.find(
      edge => edge.data.source === 'app.feature' && edge.data.target === 'vendor.lib'
    );

    expect(featureToShared?.data.weight).toBe(5);
    expect(featureToVendor?.data.weight).toBe(4);
    expect(
      result.edges.some(
        edge => edge.data.source === 'app.feature' && edge.data.target === 'app.feature'
      )
    ).toBe(false);
  });

  it('keeps lifted self-loops when explicitly enabled', () => {
    const result = filterSubPackagesByDepth(createElements(), true, 2);

    const selfLoop = result.edges.find(
      edge => edge.data.source === 'app.feature' && edge.data.target === 'app.feature'
    );

    expect(selfLoop?.data.weight).toBe(6);
    expect(selfLoop?.data.id).toBe('app.feature->app.feature');
    expect(selfLoop?.data.originalEdgeIds).toEqual(['app.feature.a->app.feature.b']);
  });
});

function createElements(): ElementsDefinition {
  return {
    nodes: [
      { data: { id: 'app' } },
      { data: { id: 'app.feature' } },
      { data: { id: 'app.feature.a' } },
      { data: { id: 'app.feature.b' } },
      { data: { id: 'app.shared' } },
      { data: { id: 'app.shared.value' } },
      { data: { id: 'vendor' } },
      { data: { id: 'vendor.lib' } },
    ],
    edges: [
      { data: { source: 'app.feature.a', target: 'app.shared.value', weight: 2 } },
      { data: { source: 'app.feature.b', target: 'app.shared.value', weight: 3 } },
      { data: { source: 'app.feature.a', target: 'vendor.lib', weight: 4 } },
      { data: { source: 'app.feature.a', target: 'app.feature.b', weight: 6 } },
    ],
  };
}
