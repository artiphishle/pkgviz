import { describe, expect, it } from '@artiphishle/testosterone';
import type { ElementsDefinition } from 'cytoscape';

import { projectVisibleGraph } from '@/features/graph-view/utils/projectVisibleGraph';

describe('[graph view projection]', () => {
  it('skips single-child package levels until the first relevant branching scope', () => {
    const elements = createDeepElements();

    const src = projectVisibleGraph({
      currentPackage: 'src',
      elements,
      showCompoundNodes: false,
      showVendorPackages: true,
      subPackageDepth: 1,
    });
    const io = projectVisibleGraph({
      currentPackage: 'src.io',
      elements,
      showCompoundNodes: false,
      showVendorPackages: true,
      subPackageDepth: 1,
    });
    const reflectoring = projectVisibleGraph({
      currentPackage: 'src.io.reflectoring',
      elements,
      showCompoundNodes: false,
      showVendorPackages: true,
      subPackageDepth: 1,
    });

    expect(src.redirectPackage).toBe('src.io');
    expect(io.redirectPackage).toBe('src.io.reflectoring');
    expect(reflectoring.redirectPackage).toBeNull();
  });

  it('does not skip the parent scope of an explicit reveal target', () => {
    const result = projectVisibleGraph({
      currentPackage: 'src.io',
      elements: createDeepElements(),
      revealPackageId: 'src.io.reflectoring',
      showCompoundNodes: false,
      showVendorPackages: true,
      subPackageDepth: 1,
    });

    expect(result.redirectPackage).toBeNull();
    expect(result.elements.nodes.map(node => node.data.id)).toEqual(['src.io.reflectoring']);
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

/*** Creates the exact empty-package chain that should drill from src to src.io.reflectoring. */
function createDeepElements(): ElementsDefinition {
  return {
    nodes: [
      { data: { id: 'src' } },
      { data: { id: 'src.io' } },
      { data: { id: 'src.io.reflectoring' } },
      { data: { id: 'src.io.reflectoring.alpha' } },
      { data: { id: 'src.io.reflectoring.beta' } },
    ],
    edges: [],
  };
}
