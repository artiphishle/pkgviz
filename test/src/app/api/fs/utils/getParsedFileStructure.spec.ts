import type { IDirectory } from '@/app/api/fs/types/index';

import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';

describe('[getParsedFileStructure]', () => {
  // Test reading a Java project structure recursively
  it('reads .java project structure correctly', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');
    const projectPath = process.env.NEXT_PUBLIC_PROJECT_PATH;
    if (!projectPath) throw new Error('no project env');

    const parsedFileStructure = await getParsedFileStructure(projectPath);
    const comExampleMyapp = ((parsedFileStructure.com as IDirectory).example as IDirectory)
      .myapp as IDirectory;
    const comExampleMyappA = comExampleMyapp.a as IDirectory;
    const comExampleMyappB = comExampleMyapp.b as IDirectory;
    const comExampleMyappC = comExampleMyapp.c as IDirectory;
    const comExampleMyappD = comExampleMyapp.d as IDirectory;

    expect(comExampleMyapp['App.java'].className).toBe('App');
    expect(comExampleMyappA['A.java'].className).toBe('A');
    expect(comExampleMyappB['B.java'].className).toBe('B');
    expect(comExampleMyappC['C.java'].className).toBe('C');
    expect(comExampleMyappD['D.java'].className).toBe('D');
  });
});
