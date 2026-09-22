import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'bun:test';

describe('theme runtime ownership', () => {
  it('keeps nested scopes on the Surface runtime boundary without exposing raw context', () => {
    const root = readFileSync(new URL('../../index.ts', import.meta.url), 'utf8');
    const runtime = readFileSync(new URL('./runtime.ts', import.meta.url), 'utf8');
    expect(root).toContain('ThemeProvider, ThemeScope, useTheme');
    expect(root).not.toContain('ThemeContext');
    expect(runtime).not.toContain('ThemeRuntimeContext');
  });
});
