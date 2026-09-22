/*** Reads a non-empty Cytoscape node identity from unknown graph metadata. */
export function readGraphNodeId(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}
