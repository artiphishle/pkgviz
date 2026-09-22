import { describe, expect, it } from '@artiphishle/testosterone';
import type { ElementsDefinition } from 'cytoscape';

import { projectVisibleGraph } from '@/features/graph-view/utils/projectVisibleGraph';

describe('[graph view projection]', () => {
  it('bounds depth relative to the active package and only the enabled node categories', () => {
    const elements: ElementsDefinition = {
      nodes: [
        ...['io', 'io.app', 'io.app.a', 'io.app.a.child', 'io.app.b'].map(id => ({
          data: { id, isIntrinsic: true },
        })),
        ...['vendor', 'vendor.one', 'vendor.one.two', 'vendor.one.two.three'].map(id => ({
          data: { id, isIntrinsic: false },
          classes: 'isVendor',
        })),
      ],
      edges: ['vendor', 'vendor.one', 'vendor.one.two', 'vendor.one.two.three'].map(target => ({
        data: { source: 'io.app.a.child', target },
      })),
    };
    const input = {
      elements,
      currentPackage: 'io.app',
      showCompoundNodes: false,
      subPackageDepth: 8,
    };
    expect(projectVisibleGraph({ ...input, showVendorPackages: false }).maxSubPackageDepth).toBe(2);
    expect(projectVisibleGraph({ ...input, showVendorPackages: true }).maxSubPackageDepth).toBe(4);
    expect(
      projectVisibleGraph({ ...input, currentPackage: '', showVendorPackages: false })
        .maxSubPackageDepth
    ).toBe(4);
    const maximum = projectVisibleGraph({
      ...input,
      showVendorPackages: false,
      subPackageDepth: 2,
    });
    const excessive = projectVisibleGraph({ ...input, showVendorPackages: false });
    expect(maximum.elements).toEqual(excessive.elements);
  });

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

    expect(src.redirectPackage).toBe('src.io.reflectoring');
    expect(io.redirectPackage).toBe('src.io.reflectoring');
    expect(reflectoring.redirectPackage).toBeNull();
  });

  it('does not skip an explicit cycle scope even when it has only one direct package', () => {
    const result = projectVisibleGraph({
      currentPackage: 'src.io',
      elements: createDeepElements(),
      preservePackageScope: true,
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
    const child = result.elements.nodes.find(node => node.data.id === 'src.feature');
    expect(child?.data.parent).toBeUndefined();
    expect(child?.data.parentInactive).toBe('src');
    expect(result.elements.nodes.some(node => node.data.id === 'src')).toBe(false);
  });

  it('uses immediate labels for descendants of visible compound nodes', () => {
    const result = projectVisibleGraph({
      currentPackage: 'coderadar.core',
      elements: {
        nodes: [
          { data: { id: 'coderadar.core.projectadministration', parent: 'coderadar.core' } },
          {
            data: {
              id: 'coderadar.core.projectadministration.services',
              parent: 'coderadar.core.projectadministration',
            },
          },
          {
            data: {
              id: 'coderadar.core.projectadministration.services.filepattern',
              parent: 'coderadar.core.projectadministration.services',
            },
          },
          {
            data: {
              id: 'coderadar.core.projectadministration.services.branch',
              parent: 'coderadar.core.projectadministration.services',
            },
          },
        ],
        edges: [],
      },
      showCompoundNodes: true,
      showVendorPackages: true,
      subPackageDepth: 3,
    });

    expect(result.elements.nodes.map(node => node.data.label)).toEqual([
      'projectadministration',
      'services',
      'filepattern',
      'branch',
    ]);
  });

  it('retains package-relative labels when compound nodes are hidden', () => {
    const result = projectVisibleGraph({
      currentPackage: 'coderadar.core',
      elements: {
        nodes: [
          { data: { id: 'coderadar.core.services' } },
          { data: { id: 'coderadar.core.services.filepattern' } },
        ],
        edges: [],
      },
      showCompoundNodes: false,
      showVendorPackages: true,
      subPackageDepth: 2,
    });

    expect(result.elements.nodes.map(node => node.data.label)).toEqual(['services.filepattern']);
  });

  it('groups sibling canonical scoped vendors under one organization compound', () => {
    const result = projectVisibleGraph({
      currentPackage: '',
      elements: createScopedVendorElements(),
      showCompoundNodes: true,
      showVendorPackages: true,
      subPackageDepth: 2,
    });

    const scope = result.elements.nodes.find(node => node.data.id === 'vendor-scope:@ankhorage');
    const zora = result.elements.nodes.find(node => node.data.id === '@ankhorage/zora');
    const devtools = result.elements.nodes.find(node => node.data.id === '@ankhorage/devtools');
    const singleton = result.elements.nodes.find(node => node.data.id === '@single/only');
    const zoraEdge = result.elements.edges.find(edge => edge.data.target === '@ankhorage/zora');

    expect(scope?.data.label).toBe('@ankhorage');
    expect(scope?.classes).toBe('isVendor');
    expect(zora?.data.parent).toBe('vendor-scope:@ankhorage');
    expect(zora?.data.label).toBe('zora');
    expect(devtools?.data.parent).toBe('vendor-scope:@ankhorage');
    expect(devtools?.data.label).toBe('devtools');
    expect(singleton?.data.parent).toBeUndefined();
    expect(singleton?.data.label).toBe('@single/only');
    expect(result.elements.nodes.some(node => node.data.id === 'vendor-scope:@zora')).toBe(false);
    expect(
      result.elements.nodes.find(node => node.data.id === '@zora/list')?.data.parent
    ).toBeUndefined();
    expect(zoraEdge?.data.source).toBe('src.feature');
    expect(zoraEdge?.data.weight).toBe(2);
  });

  it('does not materialize vendor scope compounds when vendors or compounds are hidden', () => {
    const base = {
      currentPackage: '',
      elements: createScopedVendorElements(),
      subPackageDepth: 2,
    };
    const flat = projectVisibleGraph({
      ...base,
      showCompoundNodes: false,
      showVendorPackages: true,
    });
    const withoutVendors = projectVisibleGraph({
      ...base,
      showCompoundNodes: true,
      showVendorPackages: false,
    });

    expect(
      flat.elements.nodes.some(node => node.data.id === 'vendor-scope:@ankhorage')
    ).toBe(false);
    expect(
      flat.elements.nodes.find(node => node.data.id === '@ankhorage/zora')?.data.label
    ).toBe('@ankhorage/zora');
    expect(
      withoutVendors.elements.nodes.some(node => String(node.data.id).startsWith('vendor-scope:'))
    ).toBe(false);
    expect(
      withoutVendors.elements.nodes.some(node => node.data.id === '@ankhorage/zora')
    ).toBe(false);
  });
});

describe('[package scope with external dependencies]', () => {
  const elements: ElementsDefinition = {
    nodes: [
      'io',
      'io.reflectoring',
      'io.reflectoring.a',
      'io.reflectoring.b',
      'io.reflectoring.isolated',
    ].map(id => ({ data: { id, isIntrinsic: true } })),
    edges: [
      { data: { id: 'ab', source: 'io.reflectoring.a', target: 'io.reflectoring.b', weight: 2 } },
      { data: { id: 'external', source: 'io.reflectoring.a', target: 'lombok', weight: 3 } },
    ],
  };
  const graph = {
    ...elements,
    nodes: [...elements.nodes, { data: { id: 'lombok', isIntrinsic: false }, classes: 'isVendor' }],
  };
  const input = {
    elements: graph,
    currentPackage: '',
    showCompoundNodes: false,
    subPackageDepth: 2,
  };

  it('chooses the same relevant package scope with or without vendors', () => {
    expect(projectVisibleGraph({ ...input, showVendorPackages: true }).redirectPackage).toBe(
      'io.reflectoring'
    );
    expect(projectVisibleGraph({ ...input, showVendorPackages: false }).redirectPackage).toBe(
      'io.reflectoring'
    );
  });

  it('keeps adjacent vendors, edge weights and real isolated packages after navigating', () => {
    const result = projectVisibleGraph({
      ...input,
      currentPackage: 'io.reflectoring',
      showVendorPackages: true,
    });
    expect(result.redirectPackage).toBeNull();
    expect(result.elements.nodes.map(node => node.data.id)).toEqual([
      'io.reflectoring.a',
      'io.reflectoring.b',
      'io.reflectoring.isolated',
      'lombok',
    ]);
    expect(result.elements.edges.map(edge => edge.data.weight)).toEqual([2, 3]);
  });

  it('does not skip a package that itself participates in dependencies', () => {
    const related = {
      ...graph,
      edges: [...graph.edges, { data: { source: 'io', target: 'lombok' } }],
    };
    expect(
      projectVisibleGraph({ ...input, elements: related, showVendorPackages: true }).redirectPackage
    ).toBeNull();
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

/*** Creates scoped and unscoped canonical vendor roots with stable dependency edges. */
function createScopedVendorElements(): ElementsDefinition {
  return {
    nodes: [
      { data: { id: 'src', isIntrinsic: true } },
      { data: { id: 'src.feature', isIntrinsic: true, parent: 'src' } },
      {
        data: { id: '@ankhorage/zora', classification: 'vendor', isIntrinsic: false },
        classes: 'isVendor',
      },
      {
        data: { id: '@ankhorage/devtools', classification: 'vendor', isIntrinsic: false },
        classes: 'isVendor',
      },
      {
        data: { id: '@ankhorage/supabase', classification: 'vendor', isIntrinsic: false },
        classes: 'isVendor',
      },
      {
        data: { id: '@single/only', classification: 'vendor', isIntrinsic: false },
        classes: 'isVendor',
      },
      {
        data: { id: 'react', classification: 'vendor', isIntrinsic: false },
        classes: 'isVendor',
      },
      {
        data: { id: '@zora/list', classification: 'unknown', isIntrinsic: false },
        classes: 'isVendor',
      },
      {
        data: { id: '@zora/tree-view', classification: 'unknown', isIntrinsic: false },
        classes: 'isVendor',
      },
    ],
    edges: [
      { data: { id: 'zora', source: 'src.feature', target: '@ankhorage/zora', weight: 2 } },
      { data: { id: 'devtools', source: 'src.feature', target: '@ankhorage/devtools', weight: 3 } },
      { data: { id: 'supabase', source: 'src.feature', target: '@ankhorage/supabase', weight: 4 } },
      { data: { id: 'single', source: 'src.feature', target: '@single/only', weight: 5 } },
      { data: { id: 'react', source: 'src.feature', target: 'react', weight: 6 } },
      { data: { id: 'zora-list', source: 'src.feature', target: '@zora/list', weight: 7 } },
      {
        data: {
          id: 'zora-tree-view',
          source: 'src.feature',
          target: '@zora/tree-view',
          weight: 8,
        },
      },
    ],
  };
}
