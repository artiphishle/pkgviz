import { readFileSync } from 'node:fs';

import { describe, expect, test } from 'bun:test';

import { createTheme, type SurfaceTheme } from './public';

describe('public theme subpath', () => {
  test('resolves a complete theme through the pure owner entrypoint', () => {
    const theme: SurfaceTheme = createTheme();

    expect(theme.colorDiagnostics.generated.swatches).toBe(theme.swatches);
    expect(theme.semantics.selection.background).toBeDefined();
  });

  test('keeps React and React Native outside the public module graph root', () => {
    const source = readFileSync(new URL('./public.ts', import.meta.url), 'utf8');

    expect(source).not.toContain('ThemeContext');
    expect(source).not.toMatch(/from ['"]react(?:-native)?['"]/);
    expect(source).toContain("export { createTheme } from './application/use-cases/createTheme';");
  });

  test('imports and executes through the package subpath in plain Bun', async () => {
    const script = [
      "import { createTheme } from '@ankhorage/surface/theme';",
      'const theme = createTheme();',
      'process.stdout.write(`${theme.config.id}:${theme.colorDiagnostics.mode}`);',
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
    expect(stdout).toBe('default:light');
  });
});
