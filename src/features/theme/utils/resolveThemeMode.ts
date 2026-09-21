/*** Keeps theme-sensitive markup stable until the client can use its selected theme. */
export function resolveThemeMode(
  themeMounted: boolean,
  activeTheme: string | undefined
): 'dark' | 'light' {
  return themeMounted && activeTheme === 'dark' ? 'dark' : 'light';
}
