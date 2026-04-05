"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useProductsFilter } from "@/hooks/useProductsFilter";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/product/ProductSkeletons";
import { Pagination } from "@/components/product/Pagination";
import { Button } from "@/components/ui/button";
import {
  SlidersHorizontal,
  Search,
  RotateCcw,
  LayoutGrid,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Category } from "@/types/types";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const {
    filteredProducts,
    categories,
    isLoading,
    filters,
    pagination,
    clearFilters,
  } = useProductsFilter(
    searchParams.get("search") || "",
    searchParams.get("category") || "",
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pagination.currentPage]);

  if (!isMounted)
    return (
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <ProductGridSkeleton count={9} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* HEADER DINÁMICO */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1 w-8 bg-indigo-600 rounded-full" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600">
                Premium Catalog
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
              {filters.selectedCategory
                ? filters.selectedCategory
                : "Todos los Productos"}
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            <span className="pl-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              {pagination.totalResults} Items
            </span>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden bg-slate-950 rounded-xl"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" /> Filtros
            </Button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* SIDEBAR DE FILTROS (Refactorizado) */}
          <aside
            className={`lg:w-80 shrink-0 ${showFilters ? "fixed inset-0 z-50 bg-white p-8 overflow-y-auto lg:relative lg:inset-auto lg:p-0 lg:bg-transparent" : "hidden lg:block"}`}
          >
            {/* Cabecera Filtros Mobile */}
            <div className="flex lg:hidden justify-between items-center mb-8">
              <h2 className="text-2xl font-black uppercase italic">Filtros</h2>
              <Button variant="ghost" onClick={() => setShowFilters(false)}>
                <X />
              </Button>
            </div>

            <div className="space-y-8 sticky top-28">
              {/* Buscador Integrado en Sidebar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  placeholder="Buscar modelo..."
                  value={filters.searchTerm}
                  onChange={(e) => filters.setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-[1.5rem] text-sm focus:ring-2 focus:ring-indigo-500 shadow-sm outline-none transition-all"
                />
              </div>

              {/* Card de Filtros */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black text-slate-950 uppercase tracking-tighter italic">
                    Filtrar por
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 flex items-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" /> Limpiar
                  </button>
                </div>

                {/* Categorías con Contador Visual */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                      Categorías
                    </h4>
                    <div className="flex flex-col gap-1 pr-2 max-h-64 overflow-y-auto custom-scrollbar">
                      <CategoryButton
                        active={filters.selectedCategory === ""}
                        onClick={() => filters.setSelectedCategory("")}
                        label="Todo el Stock"
                      />
                      {categories.map((cat: Category) => (
                        <CategoryButton
                          key={cat.slug}
                          active={filters.selectedCategory === cat.slug}
                          onClick={() => filters.setSelectedCategory(cat.slug)}
                          label={cat.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Rango de Precio Premium */}
                  <div className="pt-6 border-t border-slate-50">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                      Presupuesto Máximo
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-2xl font-black italic text-indigo-600">
                          ${filters.priceRange.max.toLocaleString()}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2000000"
                        step="50000"
                        value={filters.priceRange.max}
                        onChange={(e) =>
                          filters.setPriceRange((p) => ({
                            ...p,
                            max: Number(e.target.value),
                          }))
                        }
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN GRID */}
          <main className="flex-1">
            {/* Sort Toolbar */}
            <div className="mb-8 flex justify-end">
              <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-xl border border-slate-100">
                <select
                  value={filters.sortBy}
                  onChange={(e) => filters.setSortBy(e.target.value)}
                  className="bg-transparent text-[10px] font-black uppercase tracking-widest px-4 py-2 outline-none cursor-pointer"
                >
                  <option value="default">Relevancia</option>
                  <option value="price-asc">Precio: Bajo a Alto</option>
                  <option value="price-desc">Precio: Alto a Bajo</option>
                  <option value="rating-desc">Mejor Calificados</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <ProductGridSkeleton count={9} />
              ) : filteredProducts.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              ) : (
                <NoResults onReset={clearFilters} />
              )}
            </AnimatePresence>

            {/* Pagination */}
            {!isLoading && filteredProducts.length > 0 && (
              <div className="mt-16 pt-8 border-t border-slate-100">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={pagination.setCurrentPage}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Sub-componentes 
const CategoryButton = ({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`group flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
      active
        ? "bg-slate-950 text-white shadow-lg shadow-slate-200 translate-x-2"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    }`}
  >
    <span className="uppercase tracking-widest italic">{label}</span>
    {active && <div className="h-1 w-1 rounded-full bg-indigo-400" />}
  </button>
);

const NoResults = ({ onReset }: { onReset: () => void }) => (
  <div className="flex flex-col items-center justify-center py-24 px-6 bg-white rounded-[3rem] border border-slate-100 border-dashed">
    <div className="p-6 bg-slate-50 rounded-full mb-6">
      <Search className="h-10 w-10 text-slate-300" />
    </div>
    <h3 className="text-xl font-black uppercase italic text-slate-900">
      Sin coincidencias
    </h3>
    <p className="text-slate-400 text-sm mt-2 text-center max-w-xs">
      No encontramos lo que buscas. Intenta ajustar los filtros o el
      presupuesto.
    </p>
    <Button
      onClick={onReset}
      variant="link"
      className="mt-6 text-indigo-600 font-black uppercase tracking-widest text-xs"
    >
      Restablecer Catálogo
    </Button>
  </div>
);

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 mt-12">
          <ProductGridSkeleton count={12} />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
