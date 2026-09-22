import { describe, expect, test } from 'bun:test';

import {
  SURFACE_COLORS,
  SURFACE_EMPHASES,
  SURFACE_PALETTE_COLORS,
  SURFACE_STATUS_COLORS,
} from './surfaceColor';

describe('public color subpath', () => {
  test('imports canonical catalogs through the package subpath in plain Bun', async () => {
    const script = [
      "import { SURFACE_COLORS, SURFACE_EMPHASES } from '@ankhorage/surface/color';",
      'process.stdout.write(`${SURFACE_COLORS.length}:${SURFACE_EMPHASES.length}`);',
    ].join('\n');
    const subprocess = Bun.spawn({
      cmd: [process.execPath, '-e', script],
      stdout: 'pipe',
      stderr: 'pipe',
    });
    const [stdout, stderr, exitCode] = await Promise.all([
      new Response(subprocess.stdout).text(),
      new Response(subprocess.stderr).text(),
      subprocess.exited,
    ]);

    expect(exitCode, stderr).toBe(0);
    expect(stdout).toBe(`${SURFACE_COLORS.length}:${SURFACE_EMPHASES.length}`);
  });

  test('keeps the package subpath aligned with the canonical catalogs', () => {
    expect(SURFACE_COLORS).toEqual([...SURFACE_PALETTE_COLORS, ...SURFACE_STATUS_COLORS, 'danger']);
  });
});
