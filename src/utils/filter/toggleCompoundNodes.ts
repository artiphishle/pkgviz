import { ElementsDefinition } from 'cytoscape';

/**
 * Toggles display of compound nodes ('parent' attribute) in the node
 * @param elements - Cytoscape elements (nodes and edges)
 * @param show - Whether to show compound nodes
 * @param currentPackage - Current package path to adjust node names when showing compound nodes
 * @returns Updated Cytoscape elements with compound nodes toggled
 */
export function toggleCompoundNodes(
  { nodes, edges }: ElementsDefinition,
  show: boolean,
  currentPackage: string
): ElementsDefinition {
  console.log('CURRENT:', currentPackage);
  const updatedNodes = nodes.map(node => {
    if (!node.data.nameInactive) node.data.nameInactive = node.data.name;
    // ACTIVE Compound Nodes
    if (show && node.data.parentInactive) {
      node.data.parent = node.data.parentInactive;
      node.data.parentInactive = undefined;
    } else if (!show && node.data.parent) {
      node.data.parentInactive = node.data.parent;
      node.data.parent = undefined;
    }
    return node;
  });

  const labelledNodes = updatedNodes.map(node => {
    if (show) {
      node.data.name = node.data.nameInactive.replace(`${currentPackage}.`, '');
    } else {
      node.data.name = node.data.nameInactive;
    }
    return node;
  });

  return { nodes: labelledNodes, edges };
}
