import type { ParsedDirectory } from '@/app/api/fs/types/index';

import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';
import { parseProjectPath } from '@/contexts/parseEnv';

describe('[getParsedFileStructure]', () => {
  // Test reading a Java project structure recursively
  it('reads .java project structure correctly', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');
    const projectPath = parseProjectPath();

    const parsedFileStructure = await getParsedFileStructure(projectPath);
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
