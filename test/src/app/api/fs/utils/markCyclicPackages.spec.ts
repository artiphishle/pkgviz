import { describe,expect,it,resolve, } from '@artiphishle/testosterone';
import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';
import { buildGraph } from '@/app/utils/buildGraph';
import { getCyclicPackageSet } from '@/app/utils/markCyclicPackages';

describe('[getCyclicPackageSet]', () => {
  it('Marks package cycle: A-B-A using nested directory structure', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const files = await getParsedFileStructure();
    const result = getCyclicPackageSet(files, buildGraph(files));
    const cyclic = Array.from(result);

    expect(cyclic.length).toBe(2);
    expect(cyclic.sort()).toEqual(['com.example.myapp.a', 'com.example.myapp.b']);
  });
});
