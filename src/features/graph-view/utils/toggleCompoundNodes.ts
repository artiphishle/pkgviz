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
  const idInactive = toGraphString(node.data.idInactive ?? node.data.id);
  const parentInactive = toOptionalGraphString(node.data.parentInactive ?? node.data.parent);
  const data = {
    ...node.data,
    idInactive,
    name: show
      ? idInactive.split('.').pop()
      : idInactive.slice(currentPackage.length ? currentPackage.length + 1 : 0),
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

/*** Normalizes graph metadata into the string identity expected by Cytoscape. */
function toGraphString(value: unknown): string {
  return value === undefined || value === null ? '' : String(value);
}

/*** Normalizes optional graph metadata without inventing an empty parent identity. */
function toOptionalGraphString(value: unknown): string | undefined {
  const normalized = toGraphString(value);
  return normalized.length > 0 ? normalized : undefined;
}
