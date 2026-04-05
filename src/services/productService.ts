import { api } from "./apiClient";
import { Product, ProductsResponse, Category } from "@/types/types";

export const productService = {
  getAllProducts: async (limit: number = 0): Promise<Product[]> => {
    const query = limit > 0 ? `?limit=${limit}` : "";
    const data = await api.get<ProductsResponse>(`/products${query}`);
    return data.products;
  },

  getProductById: (id: number): Promise<Product> =>
    api.get<Product>(`/products/${id}`),

  getCategories: (): Promise<Category[]> =>
    api.get<Category[]>("/products/categories"),

  getProductsByCategory: async (slug: string): Promise<Product[]> => {
    const data = await api.get<ProductsResponse>(`/products/category/${slug}`);
    return data.products;
  },
};
