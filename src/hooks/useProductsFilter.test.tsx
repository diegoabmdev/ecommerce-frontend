// src/hooks/useProductsFilter.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useProductsFilter } from "./useProductsFilter";
import { productService } from "@/services/productService";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => "/shop",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/services/productService", () => ({
  productService: {
    getAllProducts: vi.fn().mockResolvedValue([]),
    getCategories: vi.fn().mockResolvedValue([]),
  },
}));

describe("useProductsFilter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería inicializar correctamente y limpiar efectos pendientes", async () => {
    const { result } = renderHook(() => useProductsFilter("", ""));
    
    // Al usar waitFor, consumimos las actualizaciones de estado de los useEffect iniciales
    // eliminando los warnings de 'act'
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.filteredProducts).toEqual([]);
  });

  it("debería filtrar productos por búsqueda después del debounce", async () => {
    const mockProducts = [{ id: 1, title: "Laptop", price: 100, category: "tech", rating: 5 }];
    vi.mocked(productService.getAllProducts).mockResolvedValue(mockProducts as any);

    const { result } = renderHook(() => useProductsFilter("", ""));

    // Esperamos carga inicial para limpiar el stack de act
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      result.current.filters.setSearchTerm("lap");
    });

    // Esperamos el debounce de 300ms
    await waitFor(() => {
      expect(result.current.filteredProducts.length).toBe(1);
    }, { timeout: 1000 });
  });
});