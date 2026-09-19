'use client';
import type { Core, ElementsDefinition, EventObject } from 'cytoscape';
import { useEffect, useRef } from 'react';

import { hasChildren } from '@/utils/hasChildren';

/*** Owns hover and selection event handlers without removing listeners from other graph adapters. */
export function useGraphInteractions(input: UseGraphInteractionsInput) {
  const allElementsRef = useRef<ElementsDefinition | null>(input.allElements);
  const visibleElementsRef = useRef<ElementsDefinition | null>(input.visibleElements);
  allElementsRef.current = input.allElements;
  visibleElementsRef.current = input.visibleElements;

  useEffect(() => {
    const cy = input.cy;
    if (cy === null || cy.destroyed()) return;
    const cleanNodeInteractions = bindNodeInteractions(cy, allElementsRef, visibleElementsRef);
    const cleanEdgeInteractions = bindEdgeInteractions(cy);

    return () => {
      cleanNodeInteractions();
      cleanEdgeInteractions();
      document.body.style.cursor = 'default';
    };
  }, [input.cy]);
}

interface UseGraphInteractionsInput {
  readonly allElements: ElementsDefinition | null;
  readonly cy: Core | null;
  readonly visibleElements: ElementsDefinition | null;
}

/*** Binds node selection/hover behavior and returns a targeted cleanup function. */
function bindNodeInteractions(
  cy: Core,
  allElementsRef: React.RefObject<ElementsDefinition | null>,
  visibleElementsRef: React.RefObject<ElementsDefinition | null>
) {
  /*** Recomputes selection-based neighborhood highlighting. */
  const updateHighlights = () => {
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
  };

  /*** Applies node hover highlighting while preserving parent drill-down affordance. */
  const handleMouseOver = (event: EventObject) => {
    if (cy.destroyed()) return;
    const node = event.target;
    const visibleElements = visibleElementsRef.current;
    const rawNode = visibleElements?.nodes.find(element => element.data.id === node.data().id);

    if (rawNode && allElementsRef.current && hasChildren(rawNode, allElementsRef.current.nodes)) {
      document.body.style.cursor = 'pointer';
      if (hasChildren(rawNode, visibleElements?.nodes ?? [])) return;
    }

    cy.elements().subtract(node.outgoers()).subtract(node.incomers()).subtract(node).addClass('hushed');
    node.addClass('highlight');
    node.outgoers().addClass('highlight-outgoer');
    node.incomers().addClass('highlight-incomer');
  };

  /*** Restores selection-based highlighting after node hover exits. */
  const handleMouseOut = () => {
    if (cy.destroyed()) return;
    document.body.style.cursor = 'default';
    updateHighlights();
  };

  cy.on('select unselect', 'node', updateHighlights);
  cy.on('mouseover', 'node', handleMouseOver);
  cy.on('mouseout', 'node', handleMouseOut);

  return () => {
    cy.off('select unselect', 'node', updateHighlights);
    cy.off('mouseover', 'node', handleMouseOver);
    cy.off('mouseout', 'node', handleMouseOut);
  };
}

/*** Binds edge hover behavior and returns a targeted cleanup function. */
function bindEdgeInteractions(cy: Core) {
  const state: { highlightDelay?: ReturnType<typeof setTimeout> } = {};

  /*** Highlights one edge immediately and its endpoint nodes after a short delay. */
  const handleMouseOver = (event: EventObject) => {
    if (cy.destroyed()) return;
    const edge = event.target;
    edge.addClass('highlight-dependency');
    state.highlightDelay = setTimeout(() => {
      if (cy.destroyed()) return;
      edge.source().addClass('highlight-dependency');
      edge.target().addClass('highlight-dependency');
    }, 150);
  };

  /*** Removes delayed edge/end-point highlighting. */
  const handleMouseOut = (event: EventObject) => {
    if (cy.destroyed()) return;
    const edge = event.target;
    edge.removeClass('highlight-dependency');
    if (state.highlightDelay !== undefined) clearTimeout(state.highlightDelay);
    edge.source().removeClass('highlight-dependency');
    edge.target().removeClass('highlight-dependency');
  };

  cy.on('mouseover', 'edge', handleMouseOver);
  cy.on('mouseout', 'edge', handleMouseOut);

  return () => {
    if (state.highlightDelay !== undefined) clearTimeout(state.highlightDelay);
    cy.off('mouseover', 'edge', handleMouseOver);
    cy.off('mouseout', 'edge', handleMouseOut);
  };
}
