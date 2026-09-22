export interface InteractionState {
  pressed: boolean;
  hovered: boolean;
  focused: boolean;
  disabled: boolean;
}

export function resolveInteractiveState(input: Partial<InteractionState>): InteractionState {
  return {
    pressed: Boolean(input.pressed),
    hovered: Boolean(input.hovered),
    focused: Boolean(input.focused),
    disabled: Boolean(input.disabled),
  };
}
