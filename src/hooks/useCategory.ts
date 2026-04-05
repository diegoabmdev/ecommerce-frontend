"use client";

import { useEffect, useRef } from "react";
import { productService } from "@/services/productService";
import { useAsync } from "./useAsync";
import { Product, Category } from "@/types/types";
import { cacheStore } from "@/lib/cacheStore";

export function useCategory(slug?: string) {
  const key = slug ? `category-${slug}` : "categories-all";
  const { data, loading, error, execute } = useAsync<any>(key);
  const lastKey = useRef<string | null>(null);

  useEffect(() => {
    if (lastKey.current === key) return;

    const cachedData = cacheStore.get(key);
    if (!cachedData) {
      if (slug) {
        execute(() => productService.getProductsByCategory(slug));
      } else {
        execute(() => productService.getCategories());
      }
      lastKey.current = key;
    }
  }, [slug, execute, key]);

  return {
    products: slug ? ((data as Product[]) ?? []) : [],
    categories: !slug ? ((data as Category[]) ?? []) : [],
    loading,
    error,
  };
}
