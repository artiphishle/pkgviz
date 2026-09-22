export type SelectionControlKind = 'checkbox' | 'radio' | 'switch';

export function resolveSelectionControlNextChecked({
  kind,
  checked,
  disabled = false,
  readOnly = false,
}: {
  kind: SelectionControlKind;
  checked: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}): boolean | null {
  if (disabled || readOnly) {
    return null;
  }

  if (kind === 'radio') {
    return checked ? null : true;
  }

  return !checked;
}
