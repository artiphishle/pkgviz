import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

import { resolveThemeMode } from '@/features/theme/utils/resolveThemeMode';

/*** Returns one hydration-safe presentation mode for every theme-sensitive React adapter. */
export function useThemeMode(): ThemeModeState {
  const { resolvedTheme, theme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeToThemeMount,
    readThemeMounted,
    readServerThemeMounted
  );
  const activeTheme = theme === 'system' ? resolvedTheme : theme;

  return { mode: resolveThemeMode(mounted, activeTheme), mounted };
}

interface ThemeModeState {
  readonly mode: 'dark' | 'light';
  readonly mounted: boolean;
}

/*** Supplies a stable no-op subscription because mounting needs no future external updates. */
function subscribeToThemeMount(): () => void {
  return () => undefined;
}

/*** Reports that the browser theme runtime is available after hydration. */
function readThemeMounted(): boolean {
  return true;
}

/*** Keeps the server and first hydration pass on the deterministic fallback mode. */
function readServerThemeMounted(): boolean {
  return false;
}
