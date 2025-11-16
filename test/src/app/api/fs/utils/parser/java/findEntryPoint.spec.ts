import type { IDirectory, IFile } from '@/app/api/fs/types/index';

import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';
import { findEntryPoint } from '@/app/utils/parser/java/findEntryPoint';

function collectFilesFromDirectory(dir: IDirectory): IFile[] {
  const files: IFile[] = [];

  function traverse(current: IDirectory) {
    for (const key in current) {
      const entry = current[key];
      if ('path' in entry && 'package' in entry) {
        files.push(entry as IFile);
      } else {
        traverse(entry as IDirectory);
      }
    }
  }

  traverse(dir);
  return files;
}

describe('[findEntryPoint]', () => {
  // Test: Finds first public static void main
  it('Finds first public static void main', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const parsedFileStructure = await getParsedFileStructure();
    const files = collectFilesFromDirectory(parsedFileStructure);
    const entryPoint = findEntryPoint(files);

    expect(entryPoint?.className).toBe('App');
  });
});
