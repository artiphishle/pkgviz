import React from 'react';

/*** Manages delayed tooltip visibility and timer cleanup. */
export function useTooltipVisibility(delay: number, passive: boolean) {
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = React.useState(false);

  const clearTimer = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const show = React.useCallback(() => {
    if (passive) return;
    clearTimer();
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  }, [clearTimer, delay, passive]);

  const hide = React.useCallback(() => {
    clearTimer();
    setVisible(false);
  }, [clearTimer]);

  React.useEffect(() => clearTimer, [clearTimer]);

  return { hide, setVisible, show, visible } as const;
}
