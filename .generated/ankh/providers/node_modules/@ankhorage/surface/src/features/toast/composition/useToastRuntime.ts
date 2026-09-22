import React from 'react';

import type { ToastController, ToastOptions } from '../../../types/toast';

/*** Owns the toast queue, dismissal timers, and imperative controller state. */
export function useToastRuntime(defaultDuration: number) {
  const [toasts, setToasts] = React.useState<ToastEntry[]>([]);
  const timersRef = React.useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const counterRef = React.useRef(0);

  const dismissToast = React.useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = React.useCallback((options: ToastOptions) => {
    const id = options.id ?? `toast-${counterRef.current++}`;
    setToasts((current) => [...current, { ...options, id }]);
    return id;
  }, []);

  useToastTimers({ defaultDuration, dismissToast, timersRef, toasts });

  const controller = React.useMemo<ToastController>(
    () => ({ dismissToast, showToast }),
    [dismissToast, showToast],
  );

  return { controller, toasts };
}

interface ToastEntry extends ToastOptions {
  id: string;
}

interface UseToastTimersInput {
  defaultDuration: number;
  dismissToast: (id: string) => void;
  timersRef: React.RefObject<Map<string, ReturnType<typeof setTimeout>>>;
  toasts: readonly ToastEntry[];
}

/*** Synchronizes toast lifetimes with timer side effects and cleans them up on unmount. */
function useToastTimers({ defaultDuration, dismissToast, timersRef, toasts }: UseToastTimersInput) {
  React.useEffect(() => {
    const timers = timersRef.current;

    toasts.forEach((toast) => {
      if (timers.has(toast.id)) return;

      const timer = setTimeout(() => dismissToast(toast.id), toast.duration ?? defaultDuration);
      timers.set(toast.id, timer);
    });

    const activeToastIds = new Set(toasts.map((toast) => toast.id));
    timers.forEach((timer, id) => {
      if (!activeToastIds.has(id)) {
        clearTimeout(timer);
        timers.delete(id);
      }
    });
  }, [defaultDuration, dismissToast, timersRef, toasts]);

  React.useEffect(() => {
    const timers = timersRef.current;

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, [timersRef]);
}
