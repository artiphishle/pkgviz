'use client';
import type { Core, ElementsDefinition, EventObject } from 'cytoscape';
import { useEffect } from 'react';

import { hasChildren } from '@/utils/hasChildren';

/*** Owns hover and selection event handlers without removing listeners from other graph adapters. */
export function useGraphInteractions(input: UseGraphInteractionsInput) {
  useEffect(() => {
    const cy = input.cy;
    if (cy === null || cy.destroyed()) return;
    const cleanNodes = bindNodeInteractions(cy, input.allElements, input.visibleElements);
    const cleanEdges = bindEdgeInteractions(cy);

    return () => {
      cleanNodes();
      cleanEdges();
      document.body.style.cursor = 'default';
    };
  }, [input.allElements, input.cy, input.visibleElements]);
}

interface UseGraphInteractionsInput {
  readonly allElements: ElementsDefinition | null;
  readonly cy: Core | null;
  readonly visibleElements: ElementsDefinition | null;
}

/*** Binds node selection/hover behavior and returns a targeted cleanup function. */
function bindNodeInteractions(
  cy: Core,
  allElements: ElementsDefinition | null,
  visibleElements: ElementsDefinition | null
) {
  const updateHighlights = () => updateSelectionHighlights(cy);
  const handleMouseOver = (event: EventObject) =>
    highlightHoveredNode(cy, event, allElements, visibleElements);
  const handleMouseOut = () => restoreNodeHighlights(cy);

  cy.on('select unselect', 'node', updateHighlights);
  cy.on('mouseover', 'node', handleMouseOver);
  cy.on('mouseout', 'node', handleMouseOut);

  return () => {
    cy.off('select unselect', 'node', updateHighlights);
    cy.off('mouseover', 'node', handleMouseOver);
    cy.off('mouseout', 'node', handleMouseOut);
  };
}

/*** Recomputes selection-based neighborhood highlighting. */
function updateSelectionHighlights(cy: Core) {
  if (cy.destroyed()) return;
  const selectedNodes = cy.nodes(':selected');
  const all = cy.elements();
  all.removeClass('hushed highlight highlight-outgoer highlight-incomer');
  if (selectedNodes.empty()) return;
  const keep = selectedNodes.union(selectedNodes.neighborhood());
  all.difference(keep).addClass('hushed');
  selectedNodes.addClass('highlight');
  selectedNodes.outgoers().addClass('highlight-outgoer');
  selectedNodes.incomers().addClass('highlight-incomer');
}

/*** Applies node hover highlighting while preserving parent drill-down affordance. */
function highlightHoveredNode(
  cy: Core,
  event: EventObject,
  allElements: ElementsDefinition | null,
  visibleElements: ElementsDefinition | null
) {
  if (cy.destroyed()) return;
  const node = event.target;
  const rawNode = visibleElements?.nodes.find(element => element.data.id === node.data().id);

  if (rawNode && allElements && hasChildren(rawNode, allElements.nodes)) {
    document.body.style.cursor = 'pointer';
    if (hasChildren(rawNode, visibleElements?.nodes ?? [])) return;
  }

  cy.elements().subtract(node.outgoers()).subtract(node.incomers()).subtract(node).addClass('hushed');
  node.addClass('highlight');
  node.outgoers().addClass('highlight-outgoer');
  node.incomers().addClass('highlight-incomer');
}

/*** Restores selection-based highlighting after node hover exits. */
function restoreNodeHighlights(cy: Core) {
  if (cy.destroyed()) return;
  document.body.style.cursor = 'default';
  updateSelectionHighlights(cy);
}

/*** Binds edge hover behavior and returns a targeted cleanup function. */
function bindEdgeInteractions(cy: Core) {
  const state: { highlightDelay?: ReturnType<typeof setTimeout> } = {};
  const handleMouseOver = (event: EventObject) => highlightHoveredEdge(cy, event, state);
  const handleMouseOut = (event: EventObject) => clearHoveredEdge(cy, event, state);

  cy.on('mouseover', 'edge', handleMouseOver);
  cy.on('mouseout', 'edge', handleMouseOut);

  return () => {
    if (state.highlightDelay !== undefined) clearTimeout(state.highlightDelay);
    cy.off('mouseover', 'edge', handleMouseOver);
    cy.off('mouseout', 'edge', handleMouseOut);
  };
}

interface EdgeHighlightState {
  highlightDelay?: ReturnType<typeof setTimeout>;
}

/*** Highlights one edge immediately and its endpoint nodes after a short delay. */
function highlightHoveredEdge(cy: Core, event: EventObject, state: EdgeHighlightState) {
  if (cy.destroyed()) return;
  const edge = event.target;
  edge.addClass('highlight-dependency');
  state.highlightDelay = setTimeout(() => {
    if (cy.destroyed()) return;
    edge.source().addClass('highlight-dependency');
    edge.target().addClass('highlight-dependency');
  }, 150);
}

/*** Removes delayed edge/end-point highlighting. */
function clearHoveredEdge(cy: Core, event: EventObject, state: EdgeHighlightState) {
  if (cy.destroyed()) return;
  const edge = event.target;
  edge.removeClass('highlight-dependency');
  if (state.highlightDelay !== undefined) clearTimeout(state.highlightDelay);
  state.highlightDelay = undefined;
  edge.source().removeClass('highlight-dependency');
  edge.target().removeClass('highlight-dependency');
}
