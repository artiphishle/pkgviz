import { mkdtemp, mkdir, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { assert, it } from '@artiphishle/testosterone';
import { inspectParserLanguageAsync } from '../../../../src/app/utils/inspectParserLanguageAsync';
import { Language } from '../../../../src/shared/types';

it('inspects nested source files and prunes dependencies and examples', async () => {
  const root = await mkdtemp(join(tmpdir(), 'pkgviz-detector-'));
  try {
    await mkdir(join(root, 'src/deep/nested/module'), { recursive: true });
    await writeFile(join(root, 'src/deep/nested/module/main.kt'), '');
    await mkdir(join(root, 'node_modules/example'), { recursive: true });
    await writeFile(join(root, 'node_modules/example/main.ts'), '');
    await mkdir(join(root, 'examples'), { recursive: true });
    await writeFile(join(root, 'examples/main.ts'), '');
    const result = await inspectParserLanguageAsync(root);
    assert.equal(result.language, Language.Kotlin);
    assert.deepEqual(result.indicators, ['src/deep/nested/module/main.kt']);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

it('reports incomplete scans rather than treating partial evidence as complete', async () => {
  const root = await mkdtemp(join(tmpdir(), 'pkgviz-detector-'));
  try {
    await writeFile(join(root, 'main.ts'), '');
    await symlink(join(root, 'main.ts'), join(root, 'linked.ts'));
    await assert.rejects(inspectParserLanguageAsync(root), /inspection is incomplete/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

it('ignores the generated ZORA runtime directory during project inspection', async () => {
  const root = await mkdtemp(join(tmpdir(), 'pkgviz-detector-'));
  try {
    await writeFile(join(root, 'main.ts'), '');
    await mkdir(join(root, '.ankh/zora'), { recursive: true });
    await symlink(root, join(root, '.ankh/zora/web'));

    const result = await inspectParserLanguageAsync(root);
    assert.equal(result.language, Language.TypeScript);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

it('normalizes an unavailable inspection root to a project path error', async () => {
  const root = await mkdtemp(join(tmpdir(), 'pkgviz-missing-'));
  await rm(root, { recursive: true, force: true });

  await assert.rejects(
    inspectParserLanguageAsync(root),
    new RegExp(`Invalid or unavailable project path: ${root}`)
  );
});
