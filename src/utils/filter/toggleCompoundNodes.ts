import type { ElementsDefinition, NodeDefinition } from 'cytoscape';

/*** Toggles compound-parent metadata without mutating the source graph elements. */
export function toggleCompoundNodes(
  { nodes, edges }: ElementsDefinition,
  show: boolean,
  currentPackage: string
): ElementsDefinition {
  return {
    nodes: nodes.map(node => toggleCompoundNode(node, show, currentPackage)),
    edges,
  };
}

/*** Produces one compound-visibility node projection from immutable source data. */
function toggleCompoundNode(
  node: NodeDefinition,
  show: boolean,
  currentPackage: string
): NodeDefinition {
  const idInactive = node.data.idInactive ?? node.data.id;
  const parentInactive = node.data.parentInactive ?? node.data.parent;
  const data = {
    ...node.data,
    idInactive,
    name: show
      ? String(idInactive).split('.').pop()
      : String(idInactive).slice(currentPackage.length ? currentPackage.length + 1 : 0),
  };

  if (show) {
    return {
      ...node,
      data: {
        ...data,
        parent: parentInactive,
        parentInactive: undefined,
      },
    };
  }

  return {
    ...node,
    data: {
      ...data,
      parent: undefined,
      parentInactive,
    },
  };
}
