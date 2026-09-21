import { readFile } from 'node:fs/promises';

import { assert, describe, it } from '@artiphishle/testosterone';

describe('[package manifest]', () => {
  it('publishes production Next.js output without build caches', async () => {
    const manifest = JSON.parse(await readFile('package.json', 'utf8')) as PackageManifest;

    assert.deepEqual(manifest.files, [
      'bin',
      'src',
      'tsconfig.json',
      '.next/BUILD_ID',
      '.next/*.js',
      '.next/*.json',
      '.next/server',
      '.next/static',
    ]);
    assert.equal(manifest.files.includes('.next'), false);
  });
});

interface PackageManifest {
  readonly files: readonly string[];
}
