import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useProducts } from "./useProducts";
import { cacheStore } from "@/lib/cacheStore";
import { productService } from "@/services/productService";

// Mockeamos el servicio para controlar la respuesta y los tiempos
vi.mock("@/services/productService", () => ({
  productService: {
    getAllProducts: vi.fn(),
  },
}));

describe("useProducts Hook (con Caché)", () => {
  const mockData = [{ id: 1, title: 'Producto Mock' }];

  beforeEach(() => {
    cacheStore.clear();
    vi.clearAllMocks();
    // Configuramos el mock para que devuelva una promesa resuelta
    vi.mocked(productService.getAllProducts).mockResolvedValue(mockData as any);
  });

  it("debería cargar productos desde la API en la primera llamada", async () => {
    const { result } = renderHook(() => useProducts(5));

    // El estado inicial debe ser cargando
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.products).toHaveLength(1);
      expect(result.current.products[0].title).toBe('Producto Mock');
    });

    expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
  });

  it("debería entregar datos desde la caché en la segunda llamada sin disparar loading", async () => {
    // 1. Primera ejecución para poblar caché
    const { result: firstRender } = renderHook(() => useProducts(5));
    await waitFor(() => expect(firstRender.current.loading).toBe(false));
    expect(productService.getAllProducts).toHaveBeenCalledTimes(1);

    // 2. Segunda ejecución con el mismo limit
    const { result: secondRender } = renderHook(() => useProducts(5));

    // En esta arquitectura, al existir cacheKey, el hook inicializa 'data' 
    // directamente desde cacheStore en el useState inicial.
    expect(secondRender.current.products).toHaveLength(1);
    expect(secondRender.current.products[0].title).toBe('Producto Mock');
    
    // Verificamos que aunque se llame al execute (re-validación), 
    // los datos ya estaban ahí
    await waitFor(() => {
        expect(secondRender.current.loading).toBe(false);
    });
  });
});