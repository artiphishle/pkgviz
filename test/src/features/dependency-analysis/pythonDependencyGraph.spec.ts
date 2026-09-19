import { describe, expect, it, resolve } from '@artiphishle/testosterone';

import { parsePythonFile } from '@/app/utils/parser/python/parseFile';

describe('[Python dependency graph baseline]', () => {
  it('locks current Python package/import semantics before analyzer migration', async () => {
    const projectRoot = resolve(process.cwd(), 'examples/python/my-app/src');
    const file = resolve(projectRoot, 'services/user_service.py');
    const parsed = await parsePythonFile(file, projectRoot);

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
