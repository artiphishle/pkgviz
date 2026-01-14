import { describe,expect,it,resolve, } from '@artiphishle/testosterone';
import type { ParsedDirectory, ParsedFile } from '@/shared/types';

import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';
import { findEntryPoint } from '@/app/utils/parser/java/findEntryPoint';

function collectFilesFromDirectory(dir: ParsedDirectory): ParsedFile[] {
  const files: ParsedFile[] = [];

  function traverse(current: ParsedDirectory) {
    for (const key in current) {
      const entry = current[key];
      if ('path' in entry && 'package' in entry) {
        files.push(entry as ParsedFile);
      } else {
        traverse(entry as ParsedDirectory);
      }
    }
  }
  traverse(dir);

  return files;
}

describe('[findEntryPoint]', () => {
  it('Finds first public static void main', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const parsedFileStructure = await getParsedFileStructure();
    const files = collectFilesFromDirectory(parsedFileStructure);
    const entryPoint = findEntryPoint(files);

    expect(entryPoint?.className).toBe('App');
  });
});
