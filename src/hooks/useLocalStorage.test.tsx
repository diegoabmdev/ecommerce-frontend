// src/hooks/useLocalStorage.test.tsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
  const KEY = "test-key";

  beforeEach(() => {
    // Creamos un mock limpio de localStorage
    let store: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store[k] || null,
      setItem: (k: string, v: string) => { store[k] = v },
      clear: () => { store = {} },
    });
  });

  it("debería inicializar con el valor de localStorage si existe", () => {
    const mockData = { id: 1 };
    window.localStorage.setItem(KEY, JSON.stringify(mockData));

    const { result } = renderHook(() => useLocalStorage(KEY, { id: 0 }));
    
    expect(result.current[0]).toEqual(mockData);
  });

  it("debería actualizar el estado y localStorage", () => {
    const { result } = renderHook(() => useLocalStorage(KEY, "inicial"));

    act(() => {
      result.current[1]("nuevo");
    });

    expect(result.current[0]).toBe("nuevo");
    expect(JSON.parse(window.localStorage.getItem(KEY)!)).toBe("nuevo");
  });
});