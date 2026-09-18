import { describe, expect, it, resolve } from '@artiphishle/testosterone';

import { buildGraph } from '@/app/utils/buildGraph';
import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';
import { analyzeTypeScriptImportsAsync } from '@/features/dependency-analysis/adapters/outbound/dependency-graph/analyzeTypeScriptImportsAsync';
import { Language } from '@/shared/types';

describe('[TypeScript dependency graph migration]', () => {
  it('preserves PKGViz import semantics from the canonical dependency analyzer', async () => {
    const projectRoot = resolve(process.cwd(), 'examples/typescript/my-app');
    const importsByFile = await analyzeTypeScriptImportsAsync(projectRoot);

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

  it('keeps the existing PKGViz package graph output after the analyzer switch', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/typescript/my-app');
    const files = await getParsedFileStructure(Language.TypeScript);
    const graph = buildGraph(files);

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
