import { describe, expect, it, resolve } from '@artiphishle/testosterone';

import { readTypeScriptProjectFileMetadataAsync } from '@/features/project-analysis/adapters/outbound/source-metadata/readTypeScriptProjectFileMetadataAsync';
import { parseProjectPath } from '@/utils/parseProjectPath';

describe('[TypeScript: readTypeScriptProjectFileMetadataAsync]', () => {
  it('parses file metadata while preserving canonical dependency imports', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd());
    const projectPath = parseProjectPath();
    const file = resolve(projectPath, 'src/app/page.tsx');
    const imports = [{ name: 'src.screens.home', pkg: 'src.screens.home', isIntrinsic: true }];
    const parsedFile = await readTypeScriptProjectFileMetadataAsync(file, projectPath, imports);

    expect(parsedFile.className).toBe('page.tsx');
    expect(parsedFile.imports).toEqual(imports);
    expect(parsedFile.package).toBe('src.app');
    expect(parsedFile.path).toBe('src/app/page.tsx');
  });
});
