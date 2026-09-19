import { describe, expect, it, resolve } from '@artiphishle/testosterone';

import { parseCppFile } from '@/app/utils/parser/cpp/parseCppFile';
import { analyzeDependencyImportsAsync } from '@/features/dependency-analysis/adapters/outbound/dependency-graph/analyzeDependencyImportsAsync';

describe('[C++ dependency graph migration]', () => {
  it('preserves locked C++ namespace/include semantics through the canonical analyzer', async () => {
    const appRoot = resolve(process.cwd(), 'examples/cpp/my-app');
    const projectRoot = resolve(appRoot, 'src');
    const file = resolve(projectRoot, 'services/UserService.cpp');
    const importsByFile = await analyzeDependencyImportsAsync(appRoot, projectRoot, 'specifier');
    const parsed = await parseCppFile(
      file,
      projectRoot,
      importsByFile.get('services/UserService.cpp') ?? []
    );

    expect(parsed.package).toBe('services');
    expect(parsed.imports).toEqual([
      {
        name: 'services/UserService.h',
        pkg: 'services',
        isIntrinsic: true,
      },
      { name: 'iostream', pkg: '', isIntrinsic: false },
    ]);
  });
});
