import { describe, expect, it, resolve } from '@artiphishle/testosterone';

import { parseKotlinFile } from '@/app/utils/parser/kotlin/parseFile';

describe('[Kotlin dependency graph baseline]', () => {
  it('locks current Kotlin package/import semantics before analyzer migration', async () => {
    const projectRoot = resolve(process.cwd(), 'examples/kotlin/my-app/src/main/kotlin');
    const file = resolve(projectRoot, 'com/example/services/UserService.kt');
    const parsed = await parseKotlinFile(file, projectRoot);

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
