import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { assert, describe, it } from '@artiphishle/testosterone';

import { getAuditEvaluationAction } from '@/app/actions/audit.actions';
import { getGraphAction } from '@/app/actions/graph.actions';

describe('[project analysis actions]', () => {
  it('returns a serializable failure for a missing project root', async () => {
    const root = await mkdtemp(join(tmpdir(), 'pkgviz-missing-'));
    await rm(root, { recursive: true, force: true });

    const previousProjectPath = process.env.NEXT_PUBLIC_PROJECT_PATH;
    process.env.NEXT_PUBLIC_PROJECT_PATH = root;

    try {
      const [graphResult, auditResult] = await Promise.all([
        getGraphAction(),
        getAuditEvaluationAction(),
      ]);
      const expected = {
        ok: false,
        error: `Invalid or unavailable project path: ${root}`,
      };

      assert.deepEqual(graphResult, expected);
      assert.deepEqual(auditResult, expected);
    } finally {
      if (previousProjectPath === undefined) {
        delete process.env.NEXT_PUBLIC_PROJECT_PATH;
      } else {
        process.env.NEXT_PUBLIC_PROJECT_PATH = previousProjectPath;
      }
    }
  });
});
