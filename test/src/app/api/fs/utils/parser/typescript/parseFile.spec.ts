import { describe,expect,it,resolve, } from '@artiphishle/testosterone';
import { parseFile } from '@/app/utils/parser/typescript/parseFile';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';

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
