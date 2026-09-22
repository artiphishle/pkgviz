import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { assert, describe, it } from '@artiphishle/testosterone';

import { loadProjectOverviewAsync } from '@/features/workspace/composition/loadProjectOverviewAsync';
import { runProjectAnalysisActionAsync } from '@/utils/runProjectAnalysisActionAsync';

describe('[project analysis actions]', () => {
  it('returns a serializable failure for a missing project root', async () => {
    const root = await mkdtemp(join(tmpdir(), 'pkgviz-missing-'));
    await rm(root, { recursive: true, force: true });

    const projectResult = await runProjectAnalysisActionAsync(() => loadProjectOverviewAsync(root));
    const expected = {
      ok: false,
      error: `Invalid or unavailable project path: ${root}`,
    };

    assert.deepEqual(projectResult, expected);
  });

  it('keeps unexpected analysis failures inside the persistent project error UI contract', async () => {
    const projectResult = await runProjectAnalysisActionAsync(() =>
      Promise.reject(new Error('analysis failed'))
    );

    assert.deepEqual(projectResult, { ok: false, error: 'analysis failed' });
  });
});
