// src/hooks/useAsync.ts
import { useState, useCallback } from "react";
import { cacheStore } from "@/lib/cacheStore";

export function useAsync<T>(cacheKey?: string) {
  const [data, setData] = useState<T | null>(() => {
    return cacheKey ? cacheStore.get(cacheKey) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    const cachedData = cacheKey ? cacheStore.get(cacheKey) : null;
    if (cachedData) {
      setData(cachedData);
    } else {
      setLoading(true);
    }

    setError(null);
    try {
      const response = await asyncFunction();
      setData(response);
      if (cacheKey) cacheStore.set(cacheKey, response);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cacheKey]);

  return { data, loading, error, execute };
}