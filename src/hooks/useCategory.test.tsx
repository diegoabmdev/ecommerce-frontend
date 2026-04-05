import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCategory } from "./useCategory";
import { cacheStore } from "@/lib/cacheStore";
import { productService } from "@/services/productService";

vi.mock("@/services/productService", () => ({
  productService: { 
    getProductsByCategory: vi.fn(),
    getCategories: vi.fn() 
  }
}));

describe("useCategory (Híbrido)", () => {
  beforeEach(() => {
    cacheStore.clear();
    vi.clearAllMocks();
  });

  it("debería traer categorías cuando NO se proporciona un slug", async () => {
    const mockCats = ["cat1", "cat2"];
    vi.mocked(productService.getCategories).mockResolvedValue(mockCats as any);

    const { result } = renderHook(() => useCategory());

    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(result.current.categories).toEqual(mockCats);
    expect(result.current.products).toEqual([]);
    expect(productService.getCategories).toHaveBeenCalledTimes(1);
  });

  it("debería traer productos cuando SÍ se proporciona un slug", async () => {
    const mockProds = [{ id: 1, title: "Product A" }];
    vi.mocked(productService.getProductsByCategory).mockResolvedValue(mockProds as any);

    const { result } = renderHook(() => useCategory("electronics"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products).toEqual(mockProds);
    expect(result.current.categories).toEqual([]);
    expect(productService.getProductsByCategory).toHaveBeenCalledWith("electronics");
  });

  it("debería usar llaves de caché distintas para slug vs sin slug", async () => {
    vi.mocked(productService.getCategories).mockResolvedValue(["cats"] as any);
    vi.mocked(productService.getProductsByCategory).mockResolvedValue([{ id: 1 }] as any);

    // Llamada 1: Categorías
    const { unmount: unmount1 } = renderHook(() => useCategory());
    await waitFor(() => expect(productService.getCategories).toHaveBeenCalled());
    unmount1();

    // Llamada 2: Productos (slug)
    const { unmount: unmount2 } = renderHook(() => useCategory("electronics"));
    await waitFor(() => expect(productService.getProductsByCategory).toHaveBeenCalled());
    unmount2();

    // Verificamos que ambas existan en la cacheStore
    expect(cacheStore.get("categories-all")).toBeDefined();
    expect(cacheStore.get("category-electronics")).toBeDefined();
  });
});