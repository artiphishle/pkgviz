import type { NodeDataDefinition, NodeDefinition } from 'cytoscape';

/***
 * Checks if a node (package) has children based on id prefix.
 */
export const hasChildren = (node: NodeDefinition, nodes: NodeDataDefinition[]) =>
  nodes.some(n => n.data.id?.startsWith(`${node.data.id}.`));
