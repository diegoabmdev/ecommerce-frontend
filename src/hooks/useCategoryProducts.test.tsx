// src/hooks/useCategoryProducts.test.tsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCategoryProducts } from "./useCategoryProducts";
import { cacheStore } from "@/lib/cacheStore";
import { productService } from "@/services/productService";

vi.mock("@/services/productService", () => ({
  productService: { getProductsByCategory: vi.fn() }
}));

describe("useCategoryProducts", () => {
  beforeEach(() => {
    cacheStore.clear();
    vi.clearAllMocks();
  });

  it("debería obtener productos por slug y cachearlos", async () => {
    const mockProducts = [{ id: 1, title: 'Smartphone' }];
    vi.mocked(productService.getProductsByCategory).mockResolvedValue(mockProducts as any);

    const { result, rerender } = renderHook(({ slug }) => useCategoryProducts(slug), {
      initialProps: { slug: "smartphones" }
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.products).toHaveLength(1);
    expect(productService.getProductsByCategory).toHaveBeenCalledWith("smartphones");

    // Probar caché cambiando y volviendo al mismo slug
    const { result: secondCall } = renderHook(() => useCategoryProducts("smartphones"));
    expect(secondCall.current.products).toHaveLength(1);
    expect(productService.getProductsByCategory).toHaveBeenCalledTimes(1); // No llamó a la API de nuevo
  });
});