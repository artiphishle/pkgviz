import { describe, expect, it } from '@artiphishle/testosterone';

import { buildGraph } from '@/app/utils/buildGraph';
import type { ParsedDirectory, ParsedFile } from '@/shared/types';

describe('[buildGraph]', () => {
  it('preserves intrinsic hierarchy, vendor metadata, and weighted package edges', () => {
    const graph = buildGraph(createParsedDirectoryFixture());

    expect(graph.nodes.length).toBe(4);
    expect(graph.edges.length).toBe(2);

    const src = graph.nodes.find(node => node.data.id === 'src');
    const features = graph.nodes.find(node => node.data.id === 'src.features');
    const shared = graph.nodes.find(node => node.data.id === 'src.shared');
    const react = graph.nodes.find(node => node.data.id === 'react');

    expect(src?.data).toEqual({
      id: 'src',
      path: 'src',
      parent: '',
      label: 'src',
      name: 'src',
      isIntrinsic: true,
    });
    expect(features?.data.parent).toBe('src');
    expect(features?.data.isIntrinsic).toBe(true);
    expect(shared?.data.parent).toBe('src');
    expect(shared?.data.isIntrinsic).toBe(true);

    expect(react?.classes).toBe('isVendor');
    expect(react?.data).toEqual({
      id: 'react',
      label: 'react',
      path: 'react',
      parent: '',
      name: 'react',
    });

    const reactEdge = graph.edges.find(
      edge => edge.data.source === 'src.features' && edge.data.target === 'react'
    );
    const sharedEdge = graph.edges.find(
      edge => edge.data.source === 'src.features' && edge.data.target === 'src.shared'
    );

    expect(reactEdge?.data.id).toBe('src.features->react');
    expect(reactEdge?.data.weight).toBe(2);
    expect(sharedEdge?.data.id).toBe('src.features->src.shared');
    expect(sharedEdge?.data.weight).toBe(1);
  });
});

function createParsedDirectoryFixture(): ParsedDirectory {
  return {
    src: {
      features: {
        one: createParsedFile('src/features/one.ts', 'src.features', [
          { name: 'react', pkg: 'react', isIntrinsic: false },
          { name: '../shared/value', pkg: 'src.shared', isIntrinsic: true },
        ]),
        two: createParsedFile('src/features/two.ts', 'src.features', [
          { name: 'react', pkg: 'react', isIntrinsic: false },
        ]),
      },
      shared: {
        value: createParsedFile('src/shared/value.ts', 'src.shared', []),
      },
    },
  };
}

function createParsedFile(
  path: string,
  packageName: string,
  imports: ParsedFile['imports']
): ParsedFile {
  return {
    calls: [],
    className: path.split('/').at(-1) ?? path,
    imports,
    methods: [],
    package: packageName,
    path,
  };
}
