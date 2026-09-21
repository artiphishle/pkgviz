export interface GraphInteractionState {
  readonly hoveredNodeId: string | null;
  readonly selectedNodeIds: readonly string[];
}

export interface GraphInteractionEvent {
  readonly id: string;
  readonly type: 'pointer-enter' | 'pointer-leave' | 'select' | 'unselect';
}
