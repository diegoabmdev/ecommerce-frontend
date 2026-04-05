// src/hooks/useProducts.ts
"use client";

import { useEffect } from "react";
import { productService } from "@/services/productService";
import { useAsync } from "./useAsync";
import { Product } from "@/types/types";

export function useProducts(limit: number = 0) {
  const { data: products, loading, error, execute } = useAsync<Product[]>(`products-limit-${limit}`);

  useEffect(() => {
    execute(() => productService.getAllProducts(limit));
  }, [limit, execute]);

  return { products: products ?? [], loading, error };
}