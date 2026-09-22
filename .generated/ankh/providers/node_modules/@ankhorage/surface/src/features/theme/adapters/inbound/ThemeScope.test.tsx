import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';

import type { ThemeRuntime } from '../../../../types/theme';
import { createTheme } from '../../application/use-cases/createTheme';
import { ThemeRuntimeContext } from './ThemeRuntimeContext';
import { ThemeScope } from './ThemeScope';
import { useTheme } from './useTheme';

function ThemeProbe() {
  const { mode, theme } = useTheme();
  return <span>{`${theme.config.id}:${mode}:${theme.colorDiagnostics.mode}`}</span>;
}

const parentRuntime: ThemeRuntime = {
  theme: createTheme(),
  mode: 'light',
  setThemeConfig: () => undefined,
  setMode: () => undefined,
};

test('overrides mode without mutating the parent theme runtime', () => {
  const markup = renderToStaticMarkup(
    <ThemeRuntimeContext value={parentRuntime}>
      <ThemeProbe />
      <ThemeScope mode="dark">
        <ThemeProbe />
      </ThemeScope>
      <ThemeProbe />
    </ThemeRuntimeContext>,
  );

  expect(markup).toContain('default:light:light');
  expect(markup).toContain('default:dark:dark');
  expect(markup.match(/default:light:light/g)).toHaveLength(2);
});

test('deep-merges a nested config override while preserving the parent config', () => {
  const markup = renderToStaticMarkup(
    <ThemeRuntimeContext value={parentRuntime}>
      <ThemeProbe />
      <ThemeScope themeConfig={{ id: 'scoped' }}>
        <ThemeProbe />
      </ThemeScope>
      <ThemeProbe />
    </ThemeRuntimeContext>,
  );

  expect(markup).toContain('scoped:light:light');
  expect(markup.match(/default:light:light/g)).toHaveLength(2);
  expect(parentRuntime.theme.config.id).toBe('default');
});
