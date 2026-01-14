import { hasChildren } from '@/utils/hasChildren';
import { NodeDefinition } from 'cytoscape';
import { describe, expect, it, resolve } from '@artiphishle/testosterone';

describe('[hasChildren]', () => {
  it('returns correct children count of a node', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const nodes: NodeDefinition[] = [
      { data: { id: 'com' }, group: 'nodes' },
      { data: { id: 'com.java' }, group: 'nodes' },
    ];

    expect(hasChildren(nodes[0], nodes)).toBe(true);
  });
});
