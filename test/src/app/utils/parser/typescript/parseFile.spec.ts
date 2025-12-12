import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { parseFile } from '@/app/utils/parser/typescript/parseFile';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';

describe('[parseFile]', () => {
  it('should parse a TS file and extract metadata', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/typescript/my-app');
    const { imports } = await parseFile(
      resolve('examples/typescript/my-app/src/index.tsx'),
      parseProjectPath()
    );

    expect(imports.length).toBe(2);
    expect(imports[0].pkg).toBe('src.components');
    expect(imports[1].pkg).toBe('src.components');
  });
});
