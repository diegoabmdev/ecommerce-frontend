// src/hooks/useAsync.test.tsx
import { renderHook, act } from "@testing-library/react";
import { useAsync } from "./useAsync";
import { cacheStore } from "@/lib/cacheStore";
import { describe, expect, it, vi } from "vitest";

describe("useAsync Engine", () => {
  it("debería manejar errores de la API correctamente", async () => {
    const { result } = renderHook(() => useAsync("error-test"));
    const errorFn = () => Promise.reject(new Error("Fallo de red"));

    await act(async () => {
      try {
        await result.current.execute(errorFn);
      } catch (e) {
        // Ignoramos el error lanzado para chequear el estado del hook
      }
    });

    expect(result.current.error).toBe("Fallo de red");
    expect(result.current.loading).toBe(false);
  });

  it("debería respetar la expiración de la caché", async () => {
    const { result } = renderHook(() => useAsync("expire-test"));
    const mockFn = vi.fn().mockResolvedValue("data");

    // Forzamos un dato viejo en la caché (via manipulación manual si es necesario para el test)
    cacheStore.set("expire-test", "dato-viejo");
    
    // Simulamos paso del tiempo (via vi.useFakeTimers)
    vi.useFakeTimers();
    vi.advanceTimersByTime(1000 * 60 * 10); // 10 minutos (expira a los 5)

    await act(async () => {
      await result.current.execute(mockFn);
    });

    expect(mockFn).toHaveBeenCalled(); // Se llamó a la API porque la caché expiró
    vi.useRealTimers();
  });
});