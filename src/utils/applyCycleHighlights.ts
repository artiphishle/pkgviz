import type { Core, EdgeSingular } from 'cytoscape';

import type {
  GraphCycleHighlight,
  GraphCycleHighlightEdge,
} from '@/types/graphCycleHighlight';

/*** Applies non-invasive cycle emphasis without changing graph data or viewport state. */
export function applyCycleHighlights(
  cy: Core,
  highlights: readonly GraphCycleHighlight[]
): void {
  clearCycleHighlights(cy);
  if (highlights.length === 0) return;

  const nodeColors = buildNodeColors(highlights);
  if (!hasVisibleCycleNode(cy, nodeColors)) return;

  const edgeHighlights = buildEdgeHighlights(highlights);
  const contextIds = collectContextNodeIds(cy, nodeColors);

  cy.nodes().forEach(node => {
    const color = nodeColors.get(node.id());
    if (color) {
      node.style({ opacity: 1, 'border-color': color, 'border-width': 5 });
      return;
    }
    node.style({ opacity: contextIds.has(node.id()) ? 0.4 : 0.12 });
  });

  cy.edges().forEach(edge => {
    const highlight = edgeHighlights.get(edgeKey(edge.source().id(), edge.target().id()));
    if (!highlight) {
      edge.style({ opacity: 0.05 });
      return;
    }
    applyEdgeHighlight(edge, highlight);
  });
}

/*** Removes only the direct style properties owned by cycle emphasis. */
function clearCycleHighlights(cy: Core): void {
  cy.nodes().removeStyle('opacity border-color border-width');
  cy.edges().removeStyle(
    'opacity line-color target-arrow-color width label color font-size font-weight text-background-color text-background-opacity text-background-padding arrow-scale'
  );
}

/*** Resolves one stable display color per selected cycle node. */
function buildNodeColors(highlights: readonly GraphCycleHighlight[]): ReadonlyMap<string, string> {
  const colors = new Map<string, string>();
  for (const highlight of highlights) {
    for (const nodeId of highlight.nodeIds) colors.set(nodeId, highlight.color);
  }
  return colors;
}

/*** Resolves selected directed graph edges to their color and cycle step. */
function buildEdgeHighlights(
  highlights: readonly GraphCycleHighlight[]
): ReadonlyMap<string, ResolvedEdgeHighlight> {
  const edges = new Map<string, ResolvedEdgeHighlight>();
  for (const highlight of highlights) {
    for (const edge of highlight.edges) {
      edges.set(edgeKey(edge.source, edge.target), { color: highlight.color, edge });
    }
  }
  return edges;
}

/*** Returns whether at least one selected cycle node exists in the current graph projection. */
function hasVisibleCycleNode(cy: Core, nodeColors: ReadonlyMap<string, string>): boolean {
  return Array.from(nodeColors.keys()).some(nodeId => !cy.getElementById(nodeId).empty());
}

/*** Keeps compound ancestors of selected cycle nodes visible as softer graph context. */
function collectContextNodeIds(
  cy: Core,
  nodeColors: ReadonlyMap<string, string>
): ReadonlySet<string> {
  const contextIds = new Set<string>();
  for (const nodeId of nodeColors.keys()) {
    cy.getElementById(nodeId)
      .parents()
      .forEach(parent => {
        contextIds.add(parent.id());
      });
  }
  return contextIds;
}

/*** Applies color, direction, and step labeling to one selected dependency edge. */
function applyEdgeHighlight(
  edge: EdgeSingular,
  highlight: ResolvedEdgeHighlight
): void {
  edge.style({
    opacity: 1,
    width: 5,
    'arrow-scale': 1.8,
    color: highlight.color,
    'font-size': 11,
    'font-weight': 'bold',
    label: String(highlight.edge.step),
    'line-color': highlight.color,
    'target-arrow-color': highlight.color,
    'text-background-color': '#ffffff',
    'text-background-opacity': 0.9,
    'text-background-padding': 2,
  });
}

/*** Produces an unambiguous lookup key for a directed edge. */
function edgeKey(source: string, target: string): string {
  return `${source}\u0000${target}`;
}

interface ResolvedEdgeHighlight {
  readonly color: string;
  readonly edge: GraphCycleHighlightEdge;
}
