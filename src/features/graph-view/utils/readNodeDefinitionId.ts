import type { NodeDefinition } from 'cytoscape';

/*** Reads a Cytoscape node-definition id through a typed graph-view boundary. */
export function readNodeDefinitionId(node: NodeDefinition): string | null {
  const id: unknown = node.data.id;
  return typeof id === 'string' ? id : null;
}
