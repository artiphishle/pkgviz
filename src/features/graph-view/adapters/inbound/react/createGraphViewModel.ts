import type { GraphViewEdge, GraphViewNode } from '@zora/graph-view';
import type { ElementsDefinition } from 'cytoscape';

import { readNodeDefinitionId } from '@/features/graph-view/utils/readNodeDefinitionId';
import type { CycleHighlight } from '@/types/auditVisualization';
import { hasChildren } from '@/utils/hasChildren';

interface GraphViewModel {
  readonly edges: readonly GraphViewEdge[];
  readonly nodes: readonly GraphViewNode[];
  readonly parentNodeIds: ReadonlySet<string>;
}

/*** Projects PKGViz Cytoscape-shaped graph data into the engine-neutral ZORA GraphView contract. */
export function createGraphViewModel(
  allElements: ElementsDefinition,
  visibleElements: ElementsDefinition,
  cycleHighlights: readonly CycleHighlight[]
): GraphViewModel {
  const visibleNodeIds = new Set(
    visibleElements.nodes
      .map(node => readNodeDefinitionId(node))
      .filter((id): id is string => id !== null)
  );
  const parentById = createVisibleParentMap(visibleElements, visibleNodeIds);
  const detachedNodeIds = getDetachedNodeIds(visibleElements, parentById);
  const parentNodeIds = new Set(
    visibleElements.nodes
      .filter(node => hasChildren(node, allElements.nodes))
      .map(node => readNodeDefinitionId(node))
      .filter((id): id is string => id !== null)
  );

  return {
    edges: visibleElements.edges.flatMap(edge => createGraphViewEdge(edge, cycleHighlights)),
    nodes: visibleElements.nodes.flatMap(node =>
      createGraphViewNode(node, parentById, detachedNodeIds, parentNodeIds, cycleHighlights)
    ),
    parentNodeIds,
  };
}

/*** Builds only compound-parent relations whose parent is present in the visible graph. */
function createVisibleParentMap(
  elements: ElementsDefinition,
  visibleNodeIds: ReadonlySet<string>
): ReadonlyMap<string, string> {
  return new Map(
    elements.nodes.flatMap(node => {
      const id = readNodeDefinitionId(node);
      const parentId = readString(node.data.parent);
      return id && parentId && visibleNodeIds.has(parentId) ? [[id, parentId] as const] : [];
    })
  );
}

/*** Detaches descendants participating in ancestor edges so every dependency has drawable endpoints. */
function getDetachedNodeIds(
  elements: ElementsDefinition,
  parentById: ReadonlyMap<string, string>
): ReadonlySet<string> {
  const detachedNodeIds = new Set<string>();

  for (const edge of elements.edges) {
    const source = readString(edge.data.source);
    const target = readString(edge.data.target);
    if (!source || !target) continue;

    if (isAncestor(source, target, parentById)) detachedNodeIds.add(target);
    else if (isAncestor(target, source, parentById)) detachedNodeIds.add(source);
  }

  return detachedNodeIds;
}

/*** Returns whether one visible node contains another through the compound-parent chain. */
function isAncestor(
  possibleAncestor: string,
  nodeId: string,
  parentById: ReadonlyMap<string, string>
): boolean {
  const visited = new Set<string>();
  let current = parentById.get(nodeId);

  while (current !== undefined && !visited.has(current)) {
    if (current === possibleAncestor) return true;
    visited.add(current);
    current = parentById.get(current);
  }

  return false;
}

/*** Convert one visible node while projecting safe parent and audit-cycle presentation metadata. */
function createGraphViewNode(
  node: ElementsDefinition['nodes'][number],
  parentById: ReadonlyMap<string, string>,
  detachedNodeIds: ReadonlySet<string>,
  parentNodeIds: ReadonlySet<string>,
  cycleHighlights: readonly CycleHighlight[]
): GraphViewNode[] {
  const id = readNodeDefinitionId(node);
  if (id === null) return [];

  const cycle = findNodeCycle(id, cycleHighlights);
  const parentId = detachedNodeIds.has(id) ? undefined : parentById.get(id);

  return [
    {
      id,
      label: readString(node.data.label) ?? readString(node.data.name) ?? id,
      parentId,
      classes: appendClasses(
        readClasses(node.classes),
        parentNodeIds.has(id) ? 'isParent' : undefined,
        cycle ? 'auditCycle' : undefined
      ),
      data: {
        ...node.data,
        parent: parentId,
        ...(cycle ? { auditCycleColor: cycle.color } : {}),
      },
    },
  ];
}

/*** Convert one visible edge while projecting audit-cycle presentation metadata. */
function createGraphViewEdge(
  edge: ElementsDefinition['edges'][number],
  cycleHighlights: readonly CycleHighlight[]
): GraphViewEdge[] {
  const source = readString(edge.data.source);
  const target = readString(edge.data.target);
  if (!source || !target) return [];

  const cycle = findEdgeCycle(source, target, cycleHighlights);
  return [
    {
      id: readString(edge.data.id),
      source,
      target,
      classes: appendClasses(readClasses(edge.classes), cycle ? 'auditCycle' : undefined),
      data: {
        ...edge.data,
        ...(cycle
          ? {
              auditCycleColor: cycle.color,
              auditCycleStep: String(cycle.step),
            }
          : {}),
      },
    },
  ];
}

/*** Return the last active cycle color affecting one node, mirroring prior overlay precedence. */
function findNodeCycle(id: string, highlights: readonly CycleHighlight[]) {
  return highlights.reduce<{ readonly color: string } | null>(
    (match, highlight) =>
      highlight.cycle.packages.includes(id) ? { color: highlight.color } : match,
    null
  );
}

/*** Return the last active cycle edge metadata, mirroring prior overlay precedence. */
function findEdgeCycle(source: string, target: string, highlights: readonly CycleHighlight[]) {
  return highlights.reduce<{ readonly color: string; readonly step: number } | null>(
    (match, highlight) => {
      const index = highlight.cycle.edges.findIndex(
        edge => edge.from === source && edge.to === target
      );
      return index >= 0 ? { color: highlight.color, step: index + 1 } : match;
    },
    null
  );
}

/*** Normalize Cytoscape class declarations into the GraphView string contract. */
function readClasses(value: unknown): string {
  if (typeof value === 'string') return value;
  if (!Array.isArray(value)) return '';
  return value.filter((entry): entry is string => typeof entry === 'string').join(' ');
}

/*** Append optional classes without introducing duplicate whitespace. */
function appendClasses(base: string, ...classes: readonly (string | undefined)[]): string {
  return [base, ...classes]
    .filter(value => value && value.length > 0)
    .join(' ')
    .trim();
}

/*** Read one optional string data field at the adapter boundary. */
function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}
