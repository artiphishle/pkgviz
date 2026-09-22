import { createDependencyGraphAsync } from '@ankhorage/dependency-graph';
import { describe, expect, it, resolve } from '@artiphishle/testosterone';

import { projectDependencyImportsAsync } from '@/features/dependency-analysis/adapters/outbound/dependency-graph/projectDependencyImportsAsync';
import { readProjectSnapshotAsync } from '@/features/project-analysis/adapters/outbound/filesystem/readProjectSnapshotAsync';

describe('[TypeScript dependency graph migration]', () => {
  it('preserves PKGViz import semantics from the canonical dependency analyzer', async () => {
    const projectRoot = resolve(process.cwd(), 'examples/typescript/my-app');
    const dependencyGraph = await createDependencyGraphAsync({
      projects: [{ id: 'current', rootPath: projectRoot }],
    });
    const importsByFile = await projectDependencyImportsAsync(dependencyGraph, projectRoot);

    const rootImports = importsByFile.get('src/index.tsx') ?? [];
    const componentImports = importsByFile.get('src/components/A.tsx') ?? [];

    expect(rootImports.length).toBe(2);
    expect(rootImports[0]).toEqual({
      name: 'src.components',
      pkg: 'src.components',
      isIntrinsic: true,
    });
    expect(rootImports[1]).toEqual({
      name: 'src.components',
      pkg: 'src.components',
      isIntrinsic: true,
    });
    expect(componentImports).toEqual([{ name: 'next', pkg: 'next', isIntrinsic: false }]);
  });

  it('keeps the existing PKGViz package graph output from the owner graph', async () => {
    const projectRoot = resolve(process.cwd(), 'examples/typescript/my-app');
    const { graph } = await readProjectSnapshotAsync(projectRoot);

    const rootToComponents = graph.edges.find(
      edge => edge.data.source === 'src' && edge.data.target === 'src.components'
    );
    const componentsToNext = graph.edges.find(
      edge => edge.data.source === 'src.components' && edge.data.target === 'next'
    );

    expect(rootToComponents?.data.weight).toBe(2);
    expect(componentsToNext?.data.weight).toBe(1);
    expect(graph.nodes.some(node => node.data.id === 'src.components')).toBe(true);
    expect(graph.nodes.some(node => node.data.id === 'next' && node.classes === 'isVendor')).toBe(
      true
    );
  });
});
