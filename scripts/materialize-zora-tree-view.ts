import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const ZORA_VERSION = '20.1.0';
const repositoryRoot = resolve(import.meta.dir, '..');
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
  const result = Bun.spawnSync({
    cmd: [
      'npm',
      'pack',
      `@ankhorage/zora@${ZORA_VERSION}`,
      '--ignore-scripts',
      '--json',
      '--pack-destination',
      cacheDirectory,
    ],
    cwd: repositoryRoot,
    stderr: 'pipe',
    stdout: 'pipe',
  });
  if (result.exitCode !== 0) throw new Error(result.stderr.toString());

  const [{ filename }] = JSON.parse(result.stdout.toString()) as [{ readonly filename: string }];
  return filename;
}

/*** Extracts the published package tarball into the isolated materialization cache. */
function extractPackage(cacheDirectory: string, packageFile: string) {
  const result = Bun.spawnSync({
    cmd: ['tar', '-xzf', join(cacheDirectory, packageFile), '-C', cacheDirectory],
    stderr: 'pipe',
    stdout: 'pipe',
  });
  if (result.exitCode !== 0) throw new Error(result.stderr.toString());
}

await materializeZoraTreeViewAsync();
