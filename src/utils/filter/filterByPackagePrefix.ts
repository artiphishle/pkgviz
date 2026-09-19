/*** Filters graph elements to descendants of the selected package scope. */
export function filterByPackagePrefix(
  allElements: cytoscape.ElementsDefinition,
  packagePrefix: string
): cytoscape.ElementsDefinition {
  const normalizedPrefix = packagePrefix.replace(/\.+$/, '');
  if (!normalizedPrefix) return allElements;

  const descendantPrefix = normalizedPrefix + '.';
  const allowedNodes = allElements.nodes.filter(node => {
    const id = node.data.id ?? '';
    return id.startsWith(descendantPrefix);
  });

  const allowedNodeIds = new Set(allowedNodes.map(node => node.data.id));
  const allowedEdges = allElements.edges.filter(
    edge => allowedNodeIds.has(edge.data.source) && allowedNodeIds.has(edge.data.target)
  );

  return {
    nodes: allowedNodes,
    edges: allowedEdges,
  };
}
