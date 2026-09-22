import React from 'react';

import type { PopoverMenuAction } from '../../../types/popoverMenu';

interface PopoverMenuControllerOptions {
  actions: readonly PopoverMenuAction[];
  closeOnSelect: boolean;
  dismiss?: () => void;
  passive: boolean;
}

/*** Owns PopoverMenu visibility, active action state, and selection behavior. */
export function usePopoverMenuController({
  actions,
  closeOnSelect,
  dismiss,
  passive,
}: PopoverMenuControllerOptions) {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) setActiveIndex(resolveInitialIndex(actions));
      if (open && !nextOpen) dismiss?.();
      setOpen(nextOpen);
    },
    [actions, dismiss, open],
  );

  const close = React.useCallback(() => handleOpenChange(false), [handleOpenChange]);
  const activateAction = React.useCallback(
    (action: PopoverMenuAction) => {
      if (action.disabled || passive) return;
      action.activate?.();
      if (closeOnSelect) close();
    },
    [close, closeOnSelect, passive],
  );

  return {
    activeIndex,
    activateAction,
    close,
    handleOpenChange,
    open,
    setActiveIndex,
  } as const;
}

/*** Returns the first enabled action index for a newly opened menu. */
function resolveInitialIndex(actions: readonly PopoverMenuAction[]): number {
  const index = actions.findIndex((action) => !action.disabled);
  return index === -1 ? 0 : index;
}
