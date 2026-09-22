/*** Creates a stable tab or tab-panel id from a Tabs test id and tab value. */
export function resolveTabElementId(
  kind: 'tab' | 'panel',
  testID: string | undefined,
  value: string,
): string {
  const base = testID ? `${testID}-tabs` : 'tabs';
  return `${base}-${kind}-${sanitizeTabValue(value)}`;
}

/*** Normalizes a tab value for use inside an accessibility id. */
function sanitizeTabValue(value: string): string {
  return value.trim().replace(/[^a-zA-Z0-9_-]+/g, '-');
}
