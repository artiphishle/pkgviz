import { describe, expect, it, resolve } from '@artiphishle/testosterone';

import { parseDelphiFile } from '@/app/utils/parser/delphi/parseFile';

describe('[Delphi dependency graph baseline]', () => {
  it('locks current Delphi unit/import semantics before analyzer migration', async () => {
    const projectRoot = resolve(process.cwd(), 'examples/delphi/my-app/src');
    const file = resolve(projectRoot, 'Services/UserService.pas');
    const parsed = await parseDelphiFile(file, projectRoot);

    expect(parsed.package).toBe('Services');
    expect(parsed.imports).toEqual([
      { name: 'System.SysUtils', pkg: 'System', isIntrinsic: true },
      { name: 'Models.User', pkg: 'Models', isIntrinsic: false },
      {
        name: 'Database.UserRepository',
        pkg: 'Database',
        isIntrinsic: false,
      },
      { name: 'Utils.Logger', pkg: 'Utils', isIntrinsic: false },
      { name: 'Utils.Validator', pkg: 'Utils', isIntrinsic: false },
      { name: 'Utils.StringUtils', pkg: 'Utils', isIntrinsic: false },
    ]);
  });
});
