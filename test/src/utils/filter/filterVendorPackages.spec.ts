import { describe,expect,it,resolve, } from '@artiphishle/testosterone';
import { filterVendorPackages } from '@/utils/filter/filterVendorPackages';
import type { ElementsDefinition } from 'cytoscape';

describe('[filterVendorPackages]', () => {
  // Test: Filters vendor packages correctly
  it('filters vendor packages (not in src/main/java)', () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const elements: ElementsDefinition = {
      nodes: [
        { data: { id: 'lombok' } },
        { data: { id: 'java.util' } },
        { data: { id: 'javax.util' } },
        { data: { id: 'org.springframework.context' } },
        { data: { id: 'com.google.util' } },
        { data: { id: 'com.example.myapp.a', isIntrinsic: true } },
        { data: { id: 'com.example.myapp.b', isIntrinsic: true } },
        { data: { id: 'com.example.myapp.c', isIntrinsic: true } },
        { data: { id: 'com.example.myapp.d', isIntrinsic: true } },
      ],
      edges: [],
    };
    const result = filterVendorPackages(elements);

    expect(result.nodes.length).toBe(4);
    expect(result.nodes[0].data.id).toBe('com.example.myapp.a');
    expect(result.nodes[1].data.id).toBe('com.example.myapp.b');
    expect(result.nodes[2].data.id).toBe('com.example.myapp.c');
    expect(result.nodes[3].data.id).toBe('com.example.myapp.d');
  });
});
