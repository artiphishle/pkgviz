import type { GraphInteractionEvent, GraphInteractionState } from '@/types/graphInteraction';

/*** Tracks leaf hover separately from selection so pointer exit restores the selected neighborhood. */
export function reduceGraphInteraction(
  state: GraphInteractionState,
  event: GraphInteractionEvent
): GraphInteractionState {
  if (event.type === 'pointer-enter') {
    return state.hoveredNodeId === event.id ? state : { ...state, hoveredNodeId: event.id };
  }
  if (event.type === 'pointer-leave') {
    return state.hoveredNodeId === event.id ? { ...state, hoveredNodeId: null } : state;
  }
  const selected = state.selectedNodeIds.includes(event.id);
  if ((event.type === 'select') === selected) return state;
  return {
    ...state,
    selectedNodeIds:
      event.type === 'select'
        ? [...state.selectedNodeIds, event.id]
        : state.selectedNodeIds.filter(id => id !== event.id),
  };
}
