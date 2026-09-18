import { useEffect, useState } from 'react';

/*** Persists React state in local storage without changing the initial hydration snapshot. */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) setStoredValue(JSON.parse(item) as T);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  /*** Updates React state and the persisted local-storage value atomically. */
  const setValue = (value: T | ((previousValue: T) => T)) => {
    setStoredValue(previousValue => {
      const valueToStore =
        value instanceof Function ? value(previousValue) : value;

      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }

      return valueToStore;
    });
  };

  return [storedValue, setValue] as const;
}
