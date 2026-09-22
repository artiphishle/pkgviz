import { createDependencyGraphAsync } from '@ankhorage/dependency-graph';
import { describe, expect, it, resolve } from '@artiphishle/testosterone';

import { readKotlinProjectFileMetadata } from '@/features/project-analysis/adapters/outbound/source-metadata/readKotlinProjectFileMetadata';
import { projectDependencyImportsAsync } from '@/features/dependency-analysis/adapters/outbound/dependency-graph/projectDependencyImportsAsync';

describe('[Kotlin dependency graph migration]', () => {
  it('preserves locked Kotlin package/import semantics through the canonical analyzer', async () => {
    const appRoot = resolve(process.cwd(), 'examples/kotlin/my-app');
    const projectRoot = resolve(appRoot, 'src/main/kotlin');
    const file = resolve(projectRoot, 'com/example/services/UserService.kt');
    const dependencyGraph = await createDependencyGraphAsync({
      projects: [{ id: 'current', rootPath: appRoot }],
    });
    const importsByFile = await projectDependencyImportsAsync(
      dependencyGraph,
      appRoot,
      projectRoot,
      'specifier',
      'kotlin-standard-library'
    );
    const parsed = await readKotlinProjectFileMetadata(
      file,
      projectRoot,
      importsByFile.get('com/example/services/UserService.kt') ?? []
    );

    expect(parsed.package).toBe('com.example.services');
    expect(parsed.imports).toEqual([
      {
        name: 'com.example.models.User',
        pkg: 'com.example.models',
        isIntrinsic: false,
      },
      {
        name: 'com.example.repositories.UserRepository',
        pkg: 'com.example.repositories',
        isIntrinsic: false,
      },
      {
        name: 'com.example.utils.Logger',
        pkg: 'com.example.utils',
        isIntrinsic: false,
      },
      {
        name: 'com.example.utils.ValidationUtils',
        pkg: 'com.example.utils',
        isIntrinsic: false,
      },
      {
        name: 'java.time.LocalDateTime',
        pkg: 'java.time',
        isIntrinsic: true,
      },
      {
        name: 'java.util.UUID',
        pkg: 'java.util',
        isIntrinsic: true,
      },
    ]);
  });
});
