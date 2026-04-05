// src/hooks/useProductsFilter.ts
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { productService } from "@/services/productService";
import { convertUSDtoCLP } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAsync } from "./useAsync";
import { useDebounce } from "./useDebounce";
import { Category, Product } from "@/types/types";

const ITEMS_PER_PAGE = 8;

export function useProductsFilter(
  initialSearch: string,
  initialCategory: string,
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Data Fetching con Caché
  const {
    data: products = [],
    loading: loadingProducts,
    execute: execProducts,
  } = useAsync<Product[]>("all-products-list");
  const {
    data: categoriesData,
    loading: loadingCats,
    execute: execCats,
  } = useAsync<Category[]>("all-categories-list");
  const categories = categoriesData || [];

  // 2. Estados de Filtros
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minRating, setMinRating] = useState(
    Number(searchParams.get("minRating")) || 0,
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "default");
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: Number(searchParams.get("maxPrice")) || 10000000,
  });

  useEffect(() => {
    execProducts(() => productService.getAllProducts());
    execCats(() => productService.getCategories());
  }, [execProducts, execCats]);

  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    const categoryFromUrl = searchParams.get("category") || "";

    setSearchTerm(searchFromUrl);
    setSelectedCategory(categoryFromUrl);
    setCurrentPage(Number(searchParams.get("page")) || 1);
  }, [searchParams]);

  // 3. Lógica de Filtrado (Pure Logic)
  const filteredProducts = useMemo(() => {
    const productsArray = products ?? [];
    return productsArray
      .filter((p) => !selectedCategory || p.category === selectedCategory)
      .filter((p) =>
        p.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )
      .filter((p) => {
        const clp = convertUSDtoCLP(p.price);
        return clp >= priceRange.min && clp <= priceRange.max;
      })
      .filter((p) => p.rating >= minRating)
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating-desc") return b.rating - a.rating;
        return 0;
      });
  }, [
    products,
    debouncedSearch,
    selectedCategory,
    priceRange,
    minRating,
    sortBy,
  ]);

  // 4. Sincronización URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (selectedCategory) params.set("category", selectedCategory);
    if (priceRange.max < 10000000)
      params.set("maxPrice", priceRange.max.toString());
    if (minRating > 0) params.set("minRating", minRating.toString());
    if (sortBy !== "default") params.set("sort", sortBy);
    if (currentPage > 1) params.set("page", currentPage.toString());

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    debouncedSearch,
    selectedCategory,
    priceRange.max,
    minRating,
    sortBy,
    currentPage,
    pathname,
    router,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange({ min: 0, max: 10000000 });
    setMinRating(0);
    setSortBy("default");
    setCurrentPage(1);
  }, []);

  return {
    filteredProducts: paginatedProducts,
    categories,
    isLoading: loadingProducts || loadingCats,
    pagination: {
      currentPage,
      setCurrentPage,
      totalPages,
      totalResults: filteredProducts.length,
    },
    filters: {
      searchTerm,
      setSearchTerm,
      selectedCategory,
      setSelectedCategory,
      priceRange,
      setPriceRange,
      minRating,
      setMinRating,
      sortBy,
      setSortBy,
    },
    clearFilters,
  };
}
