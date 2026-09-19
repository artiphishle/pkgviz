'use client';
import type { Core, ElementsDefinition } from 'cytoscape';
import { useEffect } from 'react';

import { readNodeDefinitionId } from '@/features/graph-view/utils/readNodeDefinitionId';
import { hasChildren } from '@/utils/hasChildren';

/*** Synchronizes projected graph elements and structural parent interactions into Cytoscape. */
export function useGraphElements(input: UseGraphElementsInput) {
  const { allElements, cy, setCurrentPackage, visibleElements } = input;

  useEffect(() => {
    if (cy === null || visibleElements === null || cy.destroyed()) return;

    cy.batch(() => {
      cy.elements().remove();
      cy.add(visibleElements);
    });

    cy.nodes().forEach(node => {
      const visibleNode = visibleElements.nodes.find(
        element => readNodeDefinitionId(element) === node.id()
      );
      if (!visibleNode || !hasChildren(visibleNode, allElements?.nodes ?? [])) return;

      node.addClass('isParent');
      node.on('dblclick', () => setCurrentPackage(node.id().replace(/\./g, '/')));
    });
  }, [allElements, cy, setCurrentPackage, visibleElements]);
}

interface UseGraphElementsInput {
  readonly allElements: ElementsDefinition | null;
  readonly cy: Core | null;
  readonly setCurrentPackage: (path: string) => void;
  readonly visibleElements: ElementsDefinition | null;
}
