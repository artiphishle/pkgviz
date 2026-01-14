import { describe,expect,it,resolve, } from '@artiphishle/testosterone';
import type { ParsedDirectory } from '@/shared/types';

import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';

describe('[getParsedFileStructure]', () => {
  // Test reading a Java project structure recursively
  it('reads .java project structure correctly', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const parsedFileStructure = await getParsedFileStructure();
    const comExampleMyapp = (
      (parsedFileStructure.com as ParsedDirectory).example as ParsedDirectory
    ).myapp as ParsedDirectory;
    const comExampleMyappA = comExampleMyapp.a as ParsedDirectory;
    const comExampleMyappB = comExampleMyapp.b as ParsedDirectory;
    const comExampleMyappC = comExampleMyapp.c as ParsedDirectory;
    const comExampleMyappD = comExampleMyapp.d as ParsedDirectory;

    expect(comExampleMyapp['App.java'].className).toBe('App');
    expect(comExampleMyappA['A.java'].className).toBe('A');
    expect(comExampleMyappB['B.java'].className).toBe('B');
    expect(comExampleMyappC['C.java'].className).toBe('C');
    expect(comExampleMyappD['D.java'].className).toBe('D');
  });
});
