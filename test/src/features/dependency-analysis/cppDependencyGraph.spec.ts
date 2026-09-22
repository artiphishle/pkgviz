import { createDependencyGraphAsync } from '@ankhorage/dependency-graph';
import { describe, expect, it, resolve } from '@artiphishle/testosterone';

import { readCppProjectFileMetadataAsync } from '@/features/project-analysis/adapters/outbound/source-metadata/readCppProjectFileMetadataAsync';
import { projectDependencyImportsAsync } from '@/features/dependency-analysis/adapters/outbound/dependency-graph/projectDependencyImportsAsync';

describe('[C++ dependency graph migration]', () => {
  it('preserves locked C++ namespace/include semantics through the canonical analyzer', async () => {
    const appRoot = resolve(process.cwd(), 'examples/cpp/my-app');
    const projectRoot = resolve(appRoot, 'src');
    const file = resolve(projectRoot, 'services/UserService.cpp');
    const dependencyGraph = await createDependencyGraphAsync({
      projects: [{ id: 'current', rootPath: appRoot }],
    });
    const importsByFile = await projectDependencyImportsAsync(
      dependencyGraph,
      appRoot,
      projectRoot,
      'specifier'
    );
    const parsed = await readCppProjectFileMetadataAsync(
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
