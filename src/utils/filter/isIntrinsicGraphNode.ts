import type { NodeDefinition } from 'cytoscape';

/*** Identifies project nodes using the graph builder's classification, not namespace spelling. */
export function isIntrinsicGraphNode(node: NodeDefinition): boolean {
  if (typeof node.data.isIntrinsic === 'boolean') return node.data.isIntrinsic;
  const classes = Array.isArray(node.classes) ? node.classes : (node.classes ?? '').split(/\s+/);
  return !classes.includes('isVendor');
}
