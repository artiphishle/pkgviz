/*** Filters graph elements to the selected package prefix. */
export function filterByPackagePrefix(
  allElements: cytoscape.ElementsDefinition,
  packagePrefix: string
): cytoscape.ElementsDefinition {
  // PackageView entrypoint, no prefix
  if (!packagePrefix) return allElements;

  // Active filtering (subpackage view)
  const pkgPrefix = packagePrefix.endsWith('.') ? packagePrefix : packagePrefix + '.';
  const allowedNodes = allElements.nodes.filter(node => {
    return node.data.id!.startsWith(pkgPrefix);
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
