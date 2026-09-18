import { describe, expect, it, resolve } from '@artiphishle/testosterone';

import { buildGraph } from '@/app/utils/buildGraph';
import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';
import { Language } from '@/shared/types';

describe('[Java dependency graph baseline]', () => {
  it('locks current Java package dependency semantics before analyzer migration', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');
    const files = await getParsedFileStructure(Language.Java);
    const graph = buildGraph(files);

    const weights = new Map(
      graph.edges.map(edge => [
        `${edge.data.source}->${edge.data.target}`,
        edge.data.weight,
      ])
    );

    expect(weights.get('com.example.myapp->com.example.myapp.a')).toBe(1);
    expect(weights.get('com.example.myapp.a->com.example.myapp.b')).toBe(1);
    expect(weights.get('com.example.myapp.a->com.example.myapp.c')).toBe(1);
    expect(weights.get('com.example.myapp.a->com.example.myapp.d')).toBe(1);
    expect(weights.get('com.example.myapp.b->com.example.myapp.a')).toBe(1);
    expect(graph.edges.length).toBe(5);

    for (const packageName of [
      'com.example.myapp.a',
      'com.example.myapp.b',
      'com.example.myapp.c',
      'com.example.myapp.d',
    ]) {
      expect(
        graph.nodes.some(node => node.data.id === packageName && node.classes !== 'isVendor')
      ).toBe(true);
    }
  });
});
