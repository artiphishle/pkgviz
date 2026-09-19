/*** Resolves the parent graph scope needed to keep the selected package node visible. */
export function getGraphRevealScope(packageId: string): string {
  const separatorIndex = packageId.lastIndexOf('.');
  return separatorIndex < 0 ? '' : packageId.slice(0, separatorIndex);
}
