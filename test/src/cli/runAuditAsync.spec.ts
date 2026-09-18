import { cp, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, it } from 'node:test';

import { expect } from '@artiphishle/testosterone';

import { runAuditAsync } from '@/cli/runAuditAsync';
import type { Audit } from '@/types/audit';

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map(path => rm(path, { force: true, recursive: true }))
  );
});

describe('[runAuditAsync]', () => {
  it('writes the artifact before returning the blocking-rule exit code', async () => {
    const projectPath = await copyFixtureAsync('examples/java/my-app');
    const result = await runAuditAsync({
      projectPath,
      outputPath: 'audit.json',
      pretty: true,
    });
    const persisted = JSON.parse(await readFile(result.artifactPath, 'utf8')) as Audit;

    expect(result.exitCode).toBe(2);
    expect(persisted.evaluation.rules[0].id).toBe('cyclic-dependencies');
    expect(persisted.evaluation.rules[0].status).toBe('failed');
    expect(persisted.evaluation.cyclicPackages.length).toBe(1);
  });

  it('returns zero for a project without package cycles', async () => {
    const projectPath = await copyFixtureAsync('examples/typescript/my-app');
    const result = await runAuditAsync({
      projectPath,
      outputPath: 'audit.json',
      pretty: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.audit.evaluation.rules[0].status).toBe('passed');
  });
});

/*** Copies a repository fixture into an isolated temporary project root. */
async function copyFixtureAsync(relativePath: string): Promise<string> {
  const destination = await mkdtemp(join(tmpdir(), 'pkgviz-audit-'));
  temporaryDirectories.push(destination);
  await cp(resolve(process.cwd(), relativePath), destination, { recursive: true });

  return destination;
}
