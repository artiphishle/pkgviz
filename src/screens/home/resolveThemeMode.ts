/*** Keeps theme-sensitive screen markup stable until the client has hydrated. */
export function resolveThemeMode(
  themeMounted: boolean,
  activeTheme: string | undefined
): 'dark' | 'light' {
  return themeMounted && activeTheme === 'dark' ? 'dark' : 'light';
}
