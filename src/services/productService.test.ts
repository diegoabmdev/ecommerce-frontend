import { describe, it, expect, vi, beforeEach } from "vitest";
import { productService } from "./productService";
import { api } from "./apiClient";
import { Product, ProductsResponse } from "@/types/types";

vi.mock("./apiClient", () => ({
  api: {
    get: vi.fn(),
  },
}));

const apiMock = vi.mocked(api);

describe("productService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAllProducts debería solicitar la URL correcta con el límite", async () => {
    const mockResponse: ProductsResponse = {
      products: [],
      total: 0,
      skip: 0,
      limit: 10,
    };

    apiMock.get.mockResolvedValue(mockResponse);

    await productService.getAllProducts(10);

    expect(api.get).toHaveBeenCalledWith("/products?limit=10");
  });

  it("getProductById debería llamar al endpoint específico", async () => {
    const mockProduct = { id: 99, title: "Laptop" } as Product;

    apiMock.get.mockResolvedValue(mockProduct);

    const result = await productService.getProductById(99);

    expect(api.get).toHaveBeenCalledWith("/products/99");
    expect(result.id).toBe(99);
    expect(result.title).toBe("Laptop");
  });
});
