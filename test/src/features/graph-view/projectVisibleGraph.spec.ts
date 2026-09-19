import { describe, expect, it } from '@artiphishle/testosterone';
import type { ElementsDefinition } from 'cytoscape';

import { projectVisibleGraph } from '@/features/graph-view/utils/projectVisibleGraph';

describe('[graph view projection]', () => {
  it('preserves the parent scope while revealing its selected package', () => {
    const elements = createElements();

    const result = projectVisibleGraph({
      currentPackage: '',
      elements,
      revealPackageId: 'src',
      showCompoundNodes: false,
      showVendorPackages: true,
      subPackageDepth: 2,
    });

    expect(result.redirectPackage).toBeNull();
    expect(result.elements.nodes.map(node => node.data.id)).toEqual(['src', 'src.feature']);
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
    expect(result.redirectPackage).toBe('src');
  });
});

/*** Creates a minimal package hierarchy with compound metadata for projection tests. */
function createElements(): ElementsDefinition {
  return {
    nodes: [{ data: { id: 'src' } }, { data: { id: 'src.feature', parent: 'src' } }],
    edges: [],
  };
}
