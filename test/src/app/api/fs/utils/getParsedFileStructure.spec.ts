import { Language, type ParsedDirectory } from '@/shared/types';

import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, resolve } from '@artiphishle/testosterone';
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

  it('preserves empty source directories from the canonical inspection inventory', async () => {
    const root = await mkdtemp(join(tmpdir(), 'pkgviz-empty-directory-'));

    try {
      await mkdir(join(root, 'src', 'empty'), { recursive: true });
      await writeFile(join(root, 'src', 'main.py'), 'VALUE = 1\n');

      const parsedFileStructure = await getParsedFileStructure(Language.Python, root);
      const emptyDirectory = parsedFileStructure.empty as ParsedDirectory;

      expect(Object.prototype.hasOwnProperty.call(parsedFileStructure, 'empty')).toBe(true);
      expect(Object.getPrototypeOf(emptyDirectory)).toBe(null);
      expect(Object.keys(emptyDirectory)).toEqual([]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('preserves __proto__ directories as own keys without prototype pollution', async () => {
    const root = await mkdtemp(join(tmpdir(), 'pkgviz-prototype-'));
    const previousProjectPath = process.env.NEXT_PUBLIC_PROJECT_PATH;

    try {
      await mkdir(join(root, 'src', '__proto__'), { recursive: true });
      await writeFile(join(root, 'src', '__proto__', 'module.py'), 'VALUE = 1\n');
      process.env.NEXT_PUBLIC_PROJECT_PATH = root;

      const parsedFileStructure = await getParsedFileStructure(Language.Python);
      const protoDirectory = parsedFileStructure['__proto__'] as ParsedDirectory;

      expect(Object.getPrototypeOf(parsedFileStructure)).toBe(null);
      expect(Object.prototype.hasOwnProperty.call(parsedFileStructure, '__proto__')).toBe(true);
      expect(Object.getPrototypeOf(protoDirectory)).toBe(null);
      expect(Object.prototype.hasOwnProperty.call(protoDirectory, 'module.py')).toBe(true);
    } finally {
      if (previousProjectPath === undefined) {
        delete process.env.NEXT_PUBLIC_PROJECT_PATH;
      } else {
        process.env.NEXT_PUBLIC_PROJECT_PATH = previousProjectPath;
      }
      await rm(root, { recursive: true, force: true });
    }
  });
});
