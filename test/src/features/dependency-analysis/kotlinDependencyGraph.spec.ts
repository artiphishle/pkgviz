import { describe, expect, it, resolve } from '@artiphishle/testosterone';

import { parseKotlinFile } from '@/app/utils/parser/kotlin/parseFile';
import { analyzeDependencyImportsAsync } from '@/features/dependency-analysis/adapters/outbound/dependency-graph/analyzeDependencyImportsAsync';

describe('[Kotlin dependency graph migration]', () => {
  it('preserves locked Kotlin package/import semantics through the canonical analyzer', async () => {
    const appRoot = resolve(process.cwd(), 'examples/kotlin/my-app');
    const projectRoot = resolve(appRoot, 'src/main/kotlin');
    const file = resolve(projectRoot, 'com/example/services/UserService.kt');
    const importsByFile = await analyzeDependencyImportsAsync(
      appRoot,
      projectRoot,
      'specifier',
      'kotlin-standard-library'
    );
    const parsed = await parseKotlinFile(
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
