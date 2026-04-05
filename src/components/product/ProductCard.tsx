"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { formatCLP, convertUSDtoCLP } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/types/types";
import { useCart } from "@/context/CartContext";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const currentPriceCLP = convertUSDtoCLP(product.price);
  const originalPriceCLP = product.discountPercentage > 0 
    ? Math.round(currentPriceCLP / (1 - product.discountPercentage / 100)) 
    : currentPriceCLP;

  const isFavorite = isInWishlist(product.id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col bg-white rounded-[2rem] border border-slate-100 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] hover:-translate-y-1"
    >
      {/* Media Container */}
      <div className="relative aspect-[1/1.1] overflow-hidden bg-slate-50">
        <Link href={`/product/${product.id}`} className="block h-full w-full">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        
        {/* Actions Overlays */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
            className={`h-10 w-10 rounded-xl flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
              isFavorite ? "bg-rose-500 text-white" : "bg-white/80 text-slate-900 hover:bg-white"
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        </div>

        {product.discountPercentage > 10 && (
          <div className="absolute top-4 left-4 bg-slate-950 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest italic">
            -{Math.round(product.discountPercentage)}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-bold text-slate-400">{product.rating}</span>
          </div>
        </div>

        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
            {product.title}
          </h3>
        </Link>

        <div className="mt-4 flex items-end justify-between">
          <div className="flex flex-col">
            {product.discountPercentage > 5 && (
              <span className="text-[10px] text-slate-400 line-through font-medium">
                {formatCLP(originalPriceCLP)}
              </span>
            )}
            <span className="text-lg font-black text-slate-950 italic">
              {formatCLP(currentPriceCLP)}
            </span>
          </div>

          <Button
            size="icon"
            onClick={() => addToCart(product)}
            className="h-10 w-10 rounded-xl bg-slate-950 hover:bg-indigo-600 text-white shadow-lg transition-all active:scale-90"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}