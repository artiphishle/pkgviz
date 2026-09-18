import type { ElementsDefinition } from 'cytoscape';

/***
 * Toggles display of compound nodes ('parent' attribute) in the node
 */
export function toggleCompoundNodes(
  { nodes, edges }: ElementsDefinition,
  show: boolean,
  currentPackage: string
): ElementsDefinition {
  const updatedNodes = nodes.map(node => {
    if (!node.data.idInactive) node.data.idInactive = node.data.id;
    // Preserve parent metadata so compound visibility can be toggled reversibly.
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
      node.data.name = node.data.idInactive.split('.').pop();
    } else {
      node.data.name = node.data.idInactive.slice(
        currentPackage.length ? currentPackage.length + 1 : 0
      );
    }
    return node;
  });

  return { nodes: labelledNodes, edges };
}
