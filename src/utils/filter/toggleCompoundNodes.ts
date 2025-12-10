import { ElementsDefinition } from 'cytoscape';

/**
 * Toggles display of compound nodes ('parent' attribute) in the node
 */
export function toggleCompoundNodes(
  { nodes, edges }: ElementsDefinition,
  show: boolean
): ElementsDefinition {
  const updatedNodes = nodes.map(node => {
    // Reactivate inactive parent to show compound nodes again
    if (show && node.data.parentInactive) {
      node.data.parent = node.data.parentInactive;
      node.data.parentInactive = undefined;
      return node;
    }

    // Deactivate parent to hide compound nodes
    if (!show && node.data.parent) {
      node.data.parentInactive = node.data.parent;
      node.data.parent = undefined;
      return node;
    }

    // Node has no parent to toggle
    return node;
  });

  return { nodes: updatedNodes, edges };
}
