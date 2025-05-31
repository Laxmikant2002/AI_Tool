import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = T | ((prevValue: T) => T);

interface StorageError extends Error {
  code?: number;
}

interface UseLocalStorageReturn<T> {
  /** The current stored value */
  value: T;
  /** Set the stored value */
  setValue: (value: SetValue<T>) => void;
  /** Remove the item from storage */
  removeItem: () => void;
  /** Error state if any */
  error: StorageError | null;
}

/**
 * A hook for persistent storage in localStorage with TypeScript support
 * @template T - The type of the stored value
 * @param key - The key to store the value under in localStorage
 * @param initialValue - The initial value if no value exists in storage
 * @returns Object containing the current value, setter, remove function, and error state
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  const [error, setError] = useState<StorageError | null>(null);

  // Validate key
  if (!key || typeof key !== 'string') {
    throw new Error('Storage key must be a non-empty string');
  }

  // Read value from localStorage
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (parseStoredValue(item) as T) : initialValue;
    } catch (error) {
      const err = error as StorageError;
      console.warn(`Error reading localStorage key "${key}":`, err);
      setError(err);
      return initialValue;
    }
  }, [initialValue, key]);

  // Parse stored value with error handling
  function parseStoredValue(value: string): unknown {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Update localStorage and state
  const setValue = useCallback((value: SetValue<T>) => {
    try {
      setError(null);
      // Handle function updates
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        try {
          if (valueToStore === undefined) {
            window.localStorage.removeItem(key);
          } else {
            const serializedValue = JSON.stringify(valueToStore);
            window.localStorage.setItem(key, serializedValue);
            window.dispatchEvent(new Event('local-storage'));
          }
        } catch (error) {
          const err = error as StorageError;
          // Check for QuotaExceededError
          if (err.code === 22 || err.name === 'QuotaExceededError') {
            setError(new Error('localStorage quota exceeded'));
          } else {
            setError(err);
          }
          throw err;
        }
      }
    } catch (error) {
      const err = error as StorageError;
      console.warn(`Error setting localStorage key "${key}":`, err);
      setError(err);
    }
  }, [key, storedValue]);

  // Remove item from localStorage
  const removeItem = useCallback(() => {
    try {
      setError(null);
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      const err = error as StorageError;
      console.warn(`Error removing localStorage key "${key}":`, err);
      setError(err);
    }
  }, [initialValue, key]);

  // Initialize and sync with localStorage
  useEffect(() => {
    setStoredValue(readValue());
  }, [key, readValue]);

  // Sync with other windows/tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        if (e.newValue === null) {
          setStoredValue(initialValue);
        } else {
          setStoredValue(parseStoredValue(e.newValue) as T);
        }
      }
    };

    const handleCustomChange = () => {
      setStoredValue(readValue());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleCustomChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleCustomChange);
    };
  }, [initialValue, key, readValue]);

  return {
    value: storedValue,
    setValue,
    removeItem,
    error
  };
}