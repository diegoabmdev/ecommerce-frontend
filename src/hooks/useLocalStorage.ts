"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Guardamos el valor inicial en una ref para que no sea una dependencia cambiante
  const isMounted = useRef(false);
  const initialValueRef = useRef(initialValue);

  // Función de lectura estable
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") return initialValueRef.current;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValueRef.current;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValueRef.current;
    }
  }, [key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Sincronizar si la key cambia
  useEffect(() => {
    if (isMounted.current) {
      setStoredValue(readValue());
    }
    isMounted.current = true;
  }, [key, readValue]);

  // Setter estable con useCallback
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      });
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue] as const;
}