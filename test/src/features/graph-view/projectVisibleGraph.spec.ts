import { describe, expect, it } from '@artiphishle/testosterone';
import type { ElementsDefinition } from 'cytoscape';

import { projectVisibleGraph } from '@/features/graph-view/utils/projectVisibleGraph';

describe('[graph view projection]', () => {
  it('keeps the explicit root scope instead of auto-drilling into its only package', () => {
    const result = projectVisibleGraph({
      currentPackage: '',
      elements: createElements(),
      showCompoundNodes: false,
      showVendorPackages: true,
      subPackageDepth: 1,
    });

    expect(result.elements.nodes.map(node => node.data.id)).toEqual(['src']);
  });

  it('keeps an explicitly selected package scope stable', () => {
    const result = projectVisibleGraph({
      currentPackage: 'src',
      elements: createElements(),
      showCompoundNodes: false,
      showVendorPackages: true,
      subPackageDepth: 1,
    });

    expect(result.elements.nodes.map(node => node.data.id)).toEqual(['src.feature']);
  });

  it('keeps the source graph immutable while projecting compound visibility', () => {
    const elements = createElements();

    const result = projectVisibleGraph({
      currentPackage: '',
      elements,
      showCompoundNodes: false,
      showVendorPackages: true,
      subPackageDepth: 2,
    });

    expect(elements.nodes[1]?.data.parent).toBe('src');
    expect(elements.nodes[1]?.data.parentInactive).toBeUndefined();
    expect(result.elements.nodes[1]?.data.parent).toBeUndefined();
    expect(result.elements.nodes[1]?.data.parentInactive).toBe('src');
  });
});

/*** Creates a minimal package hierarchy with compound metadata for projection tests. */
function createElements(): ElementsDefinition {
  return {
    nodes: [{ data: { id: 'src' } }, { data: { id: 'src.feature', parent: 'src' } }],
    edges: [],
  };
}
