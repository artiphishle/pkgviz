import type { ThemeConfig } from '@ankhorage/contracts';
import { deepMerge } from '@ankhorage/utility/object';
import { useMemo, useState } from 'react';

import { ResponsiveProvider } from '../../../../core/responsive/ResponsiveProvider';
import { OverlayProvider } from '../../../../internal/overlay/OverlayProvider';
import type { ThemeProviderProps, ThemeRuntime } from '../../../../types/theme';
import { useFontRuntime } from '../../../font/adapters/inbound/useFontRuntime';
import { createTheme } from '../../application/use-cases/createTheme';
import { ThemeRuntimeContext } from './ThemeRuntimeContext';

/*** Install the app-level Surface theme together with global responsive and overlay runtime. */
export function ThemeProvider({
  children,
  initialConfig,
  initialMode = 'light',
}: ThemeProviderProps) {
  const defaultTheme = useMemo(() => createTheme(), []);
  const [config, setConfig] = useState<ThemeConfig>(() =>
    initialConfig ? deepMerge(defaultTheme.config, initialConfig) : defaultTheme.config,
  );
  const [mode, setMode] = useState(initialMode);
  const { activeFontId } = useFontRuntime();

  const theme = useMemo(
    () => createTheme(config, mode, activeFontId),
    [activeFontId, config, mode],
  );
  const value = useMemo<ThemeRuntime>(
    () => ({
      theme,
      mode,
      setThemeConfig: (nextConfig) => setConfig((previous) => deepMerge(previous, nextConfig)),
      setMode,
    }),
    [mode, theme],
  );

  return (
    <ResponsiveProvider>
      <ThemeRuntimeContext value={value}>
        <OverlayProvider>{children}</OverlayProvider>
      </ThemeRuntimeContext>
    </ResponsiveProvider>
  );
}
