import { describe, expect, it, resolve } from '@artiphishle/testosterone';

import { buildGraph } from '@/app/utils/buildGraph';
import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';
import { getCyclicPackageSet, getPackageCyclesWithMembers } from '@/app/utils/markCyclicPackages';

describe('[package cycles]', () => {
  it('detects the A-B-A package cycle', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const files = await getParsedFileStructure();
    const result = getCyclicPackageSet(files, buildGraph(files));
    const cyclic = Array.from(result);

    expect(cyclic.length).toBe(2);
    expect(cyclic.sort()).toEqual(['com.example.myapp.a', 'com.example.myapp.b']);
  });

  it('preserves member evidence for every edge in the cycle', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const files = await getParsedFileStructure();
    const details = getPackageCyclesWithMembers(files, buildGraph(files));

    expect(details.cycles.length).toBe(1);

    const cycle = details.cycles[0];
    expect(cycle.packages.length).toBe(3);
    expect(cycle.packages[0]).toBe(cycle.packages[2]);

    const aToB = cycle.edges.find(
      edge => edge.from === 'com.example.myapp.a' && edge.to === 'com.example.myapp.b'
    );
    const bToA = cycle.edges.find(
      edge => edge.from === 'com.example.myapp.b' && edge.to === 'com.example.myapp.a'
    );

    expect(aToB?.via.length).toBe(1);
    expect(aToB?.via[0].filePath).toBe('com/example/myapp/a/A.java');
    expect(aToB?.via[0].importName).toBe('com.example.myapp.b.B');
    expect(aToB?.via[0].isIntrinsic).toBe(true);

    expect(bToA?.via.length).toBe(1);
    expect(bToA?.via[0].filePath).toBe('com/example/myapp/b/B.java');
    expect(bToA?.via[0].importName).toBe('com.example.myapp.a.A');
    expect(bToA?.via[0].isIntrinsic).toBe(true);
  });
});
