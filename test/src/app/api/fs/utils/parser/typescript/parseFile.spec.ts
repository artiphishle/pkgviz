import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { parseFile } from '@/app/utils/parser/typescript/parseFile';
import { parseProjectPath } from '@/contexts/parseEnv';

describe('[TypeScript: parseFile]', () => {
  it('parses a .ts/.tsx file correctly', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd());
    const projectPath = parseProjectPath();
    const file = resolve(projectPath, 'src/app/page.tsx');
    const parsedFile = await parseFile(file, projectPath);

    /** @todo No class found, but: Filename shouldn't be the fallback */
    expect(parsedFile.className).toBe('page.tsx');

    expect(parsedFile.imports.length).toBe(1);
    expect(parsedFile.methods.length).toBe(0);
    expect(parsedFile.package).toBe('src.app');
    expect(parsedFile.path).toBe('src/app/page.tsx');
  });
});
