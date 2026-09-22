type FieldStateName = 'default' | 'focused' | 'disabled' | 'invalid' | 'readOnly';

export interface FieldState {
  name: FieldStateName;
  focused: boolean;
  disabled: boolean;
  invalid: boolean;
  readOnly: boolean;
}

export function resolveFieldState({
  focused = false,
  disabled = false,
  invalid = false,
  readOnly = false,
}: Partial<Omit<FieldState, 'name'>>): FieldState {
  let name: FieldStateName = 'default';

  if (disabled) {
    name = 'disabled';
  } else if (invalid) {
    name = 'invalid';
  } else if (focused) {
    name = 'focused';
  } else if (readOnly) {
    name = 'readOnly';
  }

  return {
    name,
    focused,
    disabled,
    invalid,
    readOnly,
  };
}
