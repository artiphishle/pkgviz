import type { ElementsDefinition } from 'cytoscape';

/***
 * Filters vendor packages by known package prefix
 */
export function filterVendorPackages(elements: ElementsDefinition): ElementsDefinition {
  const filteredNodes = elements.nodes.filter(node => !!node.data.isIntrinsic);
  const allowedNodeIds = new Set(filteredNodes.map(node => node.data.id));
  const filteredEdges = elements.edges.filter(
    edge => allowedNodeIds.has(edge.data.source) && allowedNodeIds.has(edge.data.target)
  );

  return {
    nodes: filteredNodes,
    edges: filteredEdges,
  };
}
