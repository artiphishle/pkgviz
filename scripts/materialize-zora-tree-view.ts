import { spawnSync } from 'node:child_process';
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ZORA_VERSION = '20.1.1';
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = join(repositoryRoot, '.generated', 'zora', 'tree-view');
const metadataPath = join(outputDirectory, 'zora-artifact.json');

/*** Materializes the pinned ZORA TreeView browser artifact without installing ZORA peer dependencies. */
async function materializeZoraTreeViewAsync() {
  if (await isCurrentArtifactAsync()) return;

  const cacheDirectory = join(repositoryRoot, '.cache', 'zora-web-artifact');
  await rm(cacheDirectory, { force: true, recursive: true });
  await rm(outputDirectory, { force: true, recursive: true });
  await mkdir(cacheDirectory, { recursive: true });
  await mkdir(outputDirectory, { recursive: true });

  const packageFile = packZora(cacheDirectory);
  extractPackage(cacheDirectory, packageFile);

  const sourceDirectory = join(cacheDirectory, 'package', 'web-dist', 'tree-view');
  await Promise.all(
    ['TreeView.js', 'TreeView.d.ts'].map(fileName =>
      copyFile(join(sourceDirectory, fileName), join(outputDirectory, fileName))
    )
  );
  await writeFile(
    metadataPath,
    `${JSON.stringify({ owner: '@ankhorage/zora', version: ZORA_VERSION, component: 'tree-view' }, null, 2)}\n`
  );
  await rm(cacheDirectory, { force: true, recursive: true });
}

/*** Returns whether the existing generated artifact already matches the pinned ZORA release. */
async function isCurrentArtifactAsync() {
  try {
    const metadata = JSON.parse(await readFile(metadataPath, 'utf8')) as {
      readonly version?: unknown;
    };
    return metadata.version === ZORA_VERSION;
  } catch {
    return false;
  }
}

/*** Downloads the exact published ZORA tarball without installing its peer graph. */
function packZora(cacheDirectory: string): string {
  const result = spawnSync(
    'npm',
    [
      'pack',
      `@ankhorage/zora@${ZORA_VERSION}`,
      '--ignore-scripts',
      '--json',
      '--pack-destination',
      cacheDirectory,
      '--registry=https://registry.npmjs.org',
      '--prefer-online',
      '--cache',
      join(cacheDirectory, 'npm-cache'),
    ],
    { cwd: repositoryRoot, encoding: 'utf8' }
  );
  if (result.status !== 0) throw new Error(result.stderr || 'Failed to download ZORA artifact.');

  const entries = JSON.parse(result.stdout) as readonly { readonly filename?: unknown }[];
  const filename = entries[0]?.filename;
  if (typeof filename !== 'string' || filename.length === 0) {
    throw new Error('npm pack did not return a ZORA package filename.');
  }
  return filename;
}

/*** Extracts the published package tarball into the isolated materialization cache. */
function extractPackage(cacheDirectory: string, packageFile: string) {
  const result = spawnSync(
    'tar',
    ['-xzf', join(cacheDirectory, packageFile), '-C', cacheDirectory],
    { encoding: 'utf8' }
  );
  if (result.status !== 0) throw new Error(result.stderr || 'Failed to extract ZORA artifact.');
}

await materializeZoraTreeViewAsync();
