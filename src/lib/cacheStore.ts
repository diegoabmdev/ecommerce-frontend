// src/lib/cacheStore.ts
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutos

export const cacheStore = {
  get: (key: string) => {
    const cached = cache.get(key);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
    if (isExpired) {
      cache.delete(key);
      return null;
    }
    return cached.data;
  },
  set: (key: string, data: any) => {
    cache.set(key, { data, timestamp: Date.now() });
  },
  clear: () => cache.clear()
};