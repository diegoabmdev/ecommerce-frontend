import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCategoriesList } from "./useCategoriesList";
import { cacheStore } from "@/lib/cacheStore";
import { productService } from "@/services/productService";

vi.mock("@/services/productService", () => ({
  productService: { getCategories: vi.fn() }
}));

describe("useCategoriesList", () => {
  const mockCategories = ["electronics", "jewelery"];

  beforeEach(() => {
    cacheStore.clear();
    vi.clearAllMocks();
    vi.mocked(productService.getCategories).mockResolvedValue(mockCategories as any);
  });

  it("debería obtener la lista de categorías y almacenarlas en caché", async () => {
    const { result, unmount } = renderHook(() => useCategoriesList());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.categories).toEqual(mockCategories);
    });

    unmount();

    // Segunda llamada: debe ser instantánea por caché
    const { result: cachedResult } = renderHook(() => useCategoriesList());
    
    expect(cachedResult.current.categories).toEqual(mockCategories);
    expect(productService.getCategories).toHaveBeenCalledTimes(1);
  });
});