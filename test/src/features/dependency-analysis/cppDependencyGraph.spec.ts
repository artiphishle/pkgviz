import { describe, expect, it, resolve } from '@artiphishle/testosterone';

import { parseCppFile } from '@/app/utils/parser/cpp/parseCppFile';

describe('[C++ dependency graph baseline]', () => {
  it('locks current C++ namespace/include semantics before analyzer migration', async () => {
    const projectRoot = resolve(process.cwd(), 'examples/cpp/my-app/src');
    const file = resolve(projectRoot, 'services/UserService.cpp');
    const parsed = await parseCppFile(file, projectRoot);

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
