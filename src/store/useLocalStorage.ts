import { useCallback, useSyncExternalStore } from 'react';

const LOCAL_STORAGE_EVENT = 'pkgviz:local-storage';

/*** Persists React state in local storage with hydration-safe server/client snapshots. */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialSnapshot = JSON.stringify(initialValue);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      /*** Notifies this hook when another document changes the same local-storage key. */
      const handleStorage = (event: StorageEvent) => {
        if (event.storageArea === window.localStorage && event.key === key) onStoreChange();
      };
      /*** Notifies this hook when the current document changes the same local-storage key. */
      const handleLocalStorage = (event: Event) => {
        if (event instanceof CustomEvent && event.detail === key) onStoreChange();
      };

      window.addEventListener('storage', handleStorage);
      window.addEventListener(LOCAL_STORAGE_EVENT, handleLocalStorage);

      return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener(LOCAL_STORAGE_EVENT, handleLocalStorage);
      };
    },
    [key]
  );

  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(key) ?? initialSnapshot;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialSnapshot;
    }
  }, [initialSnapshot, key]);

  const getServerSnapshot = useCallback(() => initialSnapshot, [initialSnapshot]);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const storedValue = parseSnapshot(snapshot, initialValue, key);

  /*** Updates local storage and notifies same-document subscribers. */
  const setValue = (value: T | ((previousValue: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;

    try {
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      window.dispatchEvent(new CustomEvent(LOCAL_STORAGE_EVENT, { detail: key }));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

/*** Parses one local-storage snapshot while preserving the configured fallback. */
function parseSnapshot<T>(snapshot: string, initialValue: T, key: string): T {
  try {
    return JSON.parse(snapshot) as T;
  } catch (error) {
    console.warn(`Error parsing localStorage key "${key}":`, error);
    return initialValue;
  }
}
