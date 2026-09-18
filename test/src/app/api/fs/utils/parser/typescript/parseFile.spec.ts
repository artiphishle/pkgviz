import { resolve } from 'node:path';
import { describe, it } from 'node:test';

import { expect } from '@artiphishle/testosterone';

import { parseFile } from '@/app/utils/parser/typescript/parseFile';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';

describe('[TypeScript: parseFile]', () => {
  it('parses file metadata while preserving canonical dependency imports', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd());
    const projectPath = parseProjectPath();
    const file = resolve(projectPath, 'src/app/page.tsx');
    const imports = [{ name: 'src.screens.home', pkg: 'src.screens.home', isIntrinsic: true }];
    const parsedFile = await parseFile(file, projectPath, imports);

    expect(parsedFile.className).toBe('page.tsx');
    expect(parsedFile.imports).toEqual(imports);
    expect(parsedFile.methods.length).toBe(0);
    expect(parsedFile.package).toBe('src.app');
    expect(parsedFile.path).toBe('src/app/page.tsx');
  });
});
