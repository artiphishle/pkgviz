import { describe, expect, it, resolve } from '@artiphishle/testosterone';

import { parsePythonFile } from '@/app/utils/parser/python/parseFile';
import { analyzeDependencyImportsAsync } from '@/features/dependency-analysis/adapters/outbound/dependency-graph/analyzeDependencyImportsAsync';

describe('[Python dependency graph migration]', () => {
  it('preserves locked Python package/import semantics through the canonical analyzer', async () => {
    const appRoot = resolve(process.cwd(), 'examples/python/my-app');
    const projectRoot = resolve(appRoot, 'src');
    const file = resolve(projectRoot, 'services/user_service.py');
    const importsByFile = await analyzeDependencyImportsAsync(
      appRoot,
      projectRoot,
      'specifier',
      'python-legacy'
    );
    const parsed = await parsePythonFile(
      file,
      projectRoot,
      importsByFile.get('services/user_service.py') ?? []
    );

    expect(parsed.package).toBe('services');
    expect(parsed.imports).toEqual([
      { name: 'typing', pkg: 'typing', isIntrinsic: false },
      { name: 'models.user', pkg: 'models', isIntrinsic: false },
      {
        name: 'database.user_repository',
        pkg: 'database',
        isIntrinsic: false,
      },
      { name: 'utils.validator', pkg: 'utils', isIntrinsic: false },
      { name: 'utils.logger', pkg: 'utils', isIntrinsic: false },
      {
        name: 'auth.password_hasher',
        pkg: 'auth',
        isIntrinsic: false,
      },
      { name: 'datetime', pkg: 'datetime', isIntrinsic: false },
    ]);
  });
});
