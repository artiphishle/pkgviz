import { describe,expect,it,resolve, } from '@artiphishle/testosterone';
import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';
import { buildGraph } from '@/app/utils/buildGraph';

describe('[buildGraph]', () => {
  it('builds correct graph (nodes & edges)', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const graph = buildGraph(await getParsedFileStructure());
    expect(graph.nodes.length).toBe(7);
    expect(graph.edges.length).toBe(5);

    expect(graph.nodes[3].data.id).toBe('com.example.myapp.a');
    expect(graph.nodes[3].data.isIntrinsic).toBe(true);
  });
});
