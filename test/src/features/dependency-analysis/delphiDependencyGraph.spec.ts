import { createDependencyGraphAsync } from '@ankhorage/dependency-graph';
import { describe, expect, it, resolve } from '@artiphishle/testosterone';

import { readDelphiProjectFileMetadataAsync } from '@/features/project-analysis/adapters/outbound/source-metadata/readDelphiProjectFileMetadataAsync';
import { projectDependencyImportsAsync } from '@/features/dependency-analysis/adapters/outbound/dependency-graph/projectDependencyImportsAsync';

describe('[Delphi dependency graph migration]', () => {
  it('preserves locked Delphi unit/import semantics through the canonical analyzer', async () => {
    const appRoot = resolve(process.cwd(), 'examples/delphi/my-app');
    const projectRoot = resolve(appRoot, 'src');
    const file = resolve(projectRoot, 'Services/UserService.pas');
    const dependencyGraph = await createDependencyGraphAsync({
      projects: [{ id: 'current', rootPath: appRoot }],
    });
    const importsByFile = await projectDependencyImportsAsync(
      dependencyGraph,
      appRoot,
      projectRoot,
      'specifier',
      'delphi-standard-library'
    );
    const parsed = await readDelphiProjectFileMetadataAsync(
      file,
      projectRoot,
      importsByFile.get('Services/UserService.pas') ?? []
    );

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
