"use client";

import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "./ProductSkeletons";

export function FeaturedProductsGrid({
  limit,
  category,
}: {
  limit?: number;
  category?: string;
}) {
  const { products, loading, error } = useProducts();

  const displayedProducts = products
    .filter((p) => !category || p.category === category)
    .slice(0, limit || products.length);

  if (loading) return <ProductGridSkeleton count={limit || 6} />;

  if (error)
    return (
      <div className="py-20 text-center bg-rose-50 rounded-[2rem] border border-rose-100">
        <p className="text-rose-600 font-bold uppercase tracking-widest text-xs">
          Error de conexión
        </p>
        <p className="text-rose-400 text-sm mt-2">{error}</p>
      </div>
    );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {displayedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
