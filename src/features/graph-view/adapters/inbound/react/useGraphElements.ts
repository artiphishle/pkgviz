'use client';
import type { Core, ElementsDefinition } from 'cytoscape';
import { useEffect } from 'react';

import { hasChildren } from '@/utils/hasChildren';

/*** Synchronizes projected graph elements and structural parent interactions into Cytoscape. */
export function useGraphElements(input: UseGraphElementsInput) {
  useEffect(() => {
    const cy = input.cy;
    if (cy === null || input.visibleElements === null || cy.destroyed()) return;

    cy.batch(() => {
      cy.elements().remove();
      cy.add(input.visibleElements!);
    });

    cy.nodes().forEach(node => {
      const visibleNode = input.visibleElements?.nodes.find(
        element => element.data.id === node.data().id
      );
      if (!visibleNode || !hasChildren(visibleNode, input.allElements?.nodes ?? [])) return;

      node.addClass('isParent');
      node.on('dblclick', () => input.setCurrentPackage(node.id().replace(/\./g, '/')));
    });
  }, [input.allElements, input.cy, input.setCurrentPackage, input.visibleElements]);
}

interface UseGraphElementsInput {
  readonly allElements: ElementsDefinition | null;
  readonly cy: Core | null;
  readonly setCurrentPackage: (path: string) => void;
  readonly visibleElements: ElementsDefinition | null;
}
