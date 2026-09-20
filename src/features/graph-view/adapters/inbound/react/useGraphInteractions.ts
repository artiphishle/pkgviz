'use client';

import type { GraphViewEdge, GraphViewElementEvent, GraphViewNode } from '@zora/graph-view';
import { useMemo, useState } from 'react';

import { applyGraphInteractionPresentation } from '@/features/graph-view/adapters/inbound/react/applyGraphInteractionPresentation';
import { reduceGraphInteraction } from '@/features/graph-view/domain/reduceGraphInteraction';
import type { GraphInteractionState } from '@/types/graphInteraction';

/*** Owns leaf interaction state and declarative presentation through public GraphView events. */
export function useGraphInteractions(
  nodes: readonly GraphViewNode[],
  edges: readonly GraphViewEdge[]
) {
  const leafIds = useMemo(() => {
    const parents = new Set(nodes.map(node => node.parentId));
    return new Set(nodes.filter(node => !parents.has(node.id)).map(node => node.id));
  }, [nodes]);
  const [snapshot, setSnapshot] = useState<{
    readonly leafIds: ReadonlySet<string>;
    readonly interaction: GraphInteractionState;
  }>({
    leafIds,
    interaction: { hoveredNodeId: null, selectedNodeIds: [] },
  });
  if (snapshot.leafIds !== leafIds) {
    setSnapshot({
      leafIds,
      interaction: {
        hoveredNodeId: null,
        selectedNodeIds: snapshot.interaction.selectedNodeIds.filter(id => leafIds.has(id)),
      },
    });
  }
  const presentation = useMemo(
    () => applyGraphInteractionPresentation(nodes, edges, snapshot.interaction),
    [nodes, edges, snapshot.interaction]
  );

  /*** Ignores compound policy and routes only the approved hover/selection events to the reducer. */
  const handleNodeEvent = (event: GraphViewElementEvent) => {
    const { id, type } = event;
    if (!leafIds.has(id) || type === 'press' || type === 'double-press') return;
    setSnapshot(previous => {
      const interaction = reduceGraphInteraction(previous.interaction, { id, type });
      return interaction === previous.interaction ? previous : { leafIds, interaction };
    });
  };
  return { ...presentation, handleNodeEvent };
}
