"use client";

import { useEffect, useRef } from "react";
import { productService } from "@/services/productService";
import { useAsync } from "./useAsync";
import { Category } from "@/types/types";
import { cacheStore } from "@/lib/cacheStore";

export function useCategoriesList() {
  const cacheKey = "all-categories";
  const { data, loading, error, execute } = useAsync<Category[]>(cacheKey);
  const fetched = useRef(false);

  useEffect(() => {
    const cachedData = cacheStore.get(cacheKey);

    if (!cachedData && !fetched.current) {
      execute(() => productService.getCategories());
      fetched.current = true;
    }
  }, [execute]);

  return { categories: data ?? [], loading, error };
}
