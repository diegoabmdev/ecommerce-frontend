// src/hooks/useCategoryProducts.ts
"use client";

import { useEffect, useRef } from "react";
import { productService } from "@/services/productService";
import { useAsync } from "./useAsync";
import { Product } from "@/types/types";
import { cacheStore } from "@/lib/cacheStore";

export function useCategoryProducts(slug: string) {
  const cacheKey = `category-products-${slug}`;
  const { data, loading, error, execute } = useAsync<Product[]>(cacheKey);
  
  const lastFetchedSlug = useRef<string | null>(null);

  useEffect(() => {
    if (!slug || lastFetchedSlug.current === slug) return;
    const cachedData = cacheStore.get(cacheKey);
    
    if (!cachedData) {
      execute(() => productService.getProductsByCategory(slug));
      lastFetchedSlug.current = slug;
    }
  }, [slug, execute, cacheKey]);

  return { products: data ?? [], loading, error };
}