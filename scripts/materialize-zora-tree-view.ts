import { spawnSync } from 'node:child_process';
import { mkdir, readFile, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ZORA_VERSION = '20.1.1';
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = join(repositoryRoot, '.generated', 'zora', 'tree-view');
const metadataPath = join(outputDirectory, 'zora-artifact.json');

/*** Materializes TreeView through ZORA's published web-component command without installing peers. */
async function materializeZoraTreeViewAsync() {
  if (await isCurrentArtifactAsync()) return;

  const cacheDirectory = join(repositoryRoot, '.cache', 'zora-web-artifact');
  await rm(cacheDirectory, { force: true, recursive: true });
  await rm(outputDirectory, { force: true, recursive: true });
  await mkdir(cacheDirectory, { recursive: true });

  const packageFile = packZora(cacheDirectory);
  extractPackage(cacheDirectory, packageFile);
  await runZoraCreateAsync(join(cacheDirectory, 'package'));
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

/*** Downloads the exact published ZORA tarball without installing its React Native peer graph. */
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

/*** Runs the published ZORA runtime-provider create handler against the consumer output directory. */
async function runZoraCreateAsync(packageRoot: string) {
  const packageJson = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8')) as {
    readonly ankh?: { readonly provider?: unknown };
  };
  const providerPath = packageJson.ankh?.provider;
  if (typeof providerPath !== 'string' || providerPath.length === 0) {
    throw new Error('Published ZORA package does not expose an Ankh provider.');
  }

  const providerModule = (await import(pathToFileURL(join(packageRoot, providerPath)).href)) as {
    readonly default?: unknown;
  };
  const handler = getCreateHandler(providerModule.default);
  const errors: string[] = [];
  const result = await handler({
    argv: ['tree-view', '--web', '--out', outputDirectory],
    context: {
      cwd: repositoryRoot,
      writeStderr(text) {
        errors.push(text);
      },
      writeStdout() {},
    },
  });

  if (result.exitCode !== 0) {
    throw new Error(errors.join('').trim() || 'ZORA create command failed.');
  }
}

interface ZoraCreateRequest {
  readonly argv: readonly string[];
  readonly context: {
    readonly cwd: string;
    writeStderr(text: string): void;
    writeStdout(text: string): void;
  };
}

type ZoraCreateHandler = (
  request: ZoraCreateRequest
) => Promise<{ readonly exitCode: number }>;

/*** Resolves the canonical create handler from ZORA's runtime-provider manifest. */
function getCreateHandler(provider: unknown): ZoraCreateHandler {
  if (!isRecord(provider) || !Array.isArray(provider.handlers)) {
    throw new Error('Published ZORA provider does not expose command handlers.');
  }

  for (const binding of provider.handlers) {
    if (
      isRecord(binding) &&
      Array.isArray(binding.path) &&
      binding.path.length === 1 &&
      binding.path[0] === 'create' &&
      typeof binding.handler === 'function'
    ) {
      return binding.handler as ZoraCreateHandler;
    }
  }

  throw new Error('Published ZORA provider does not expose the create handler.');
}

/*** Narrows unknown provider metadata to an inspectable object record. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

await materializeZoraTreeViewAsync();
