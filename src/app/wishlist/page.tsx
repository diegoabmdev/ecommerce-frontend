// src/app/wishlist/page.tsx
"use client";

import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/product/ProductCard";
import { Heart, ShoppingCart, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyWishlist } from "@/components/wishlist/EmptyWishlist";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist, totalFavorites, isInitialized, moveAllToCart } = useWishlist();

  if (!isInitialized) return <WishlistLoading />;
  if (totalFavorites === 0) return <EmptyWishlist />;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      <div className="mx-auto max-w-7xl px-6 py-16">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-slate-950 rounded-2xl flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-500/10">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
                Wish<span className="text-indigo-600">list</span>
              </h1>
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] ml-1">
              {totalFavorites} Objetos de deseo guardados
            </p>
          </div>

          <Button
            onClick={moveAllToCart}
            className="bg-indigo-600 hover:bg-slate-950 text-white rounded-[1.5rem] px-8 h-16 font-black uppercase italic shadow-2xl shadow-indigo-200 transition-all flex gap-3 group"
          >
            <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Transferir todo al carrito
          </Button>
        </header>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          <AnimatePresence mode="popLayout">
            {wishlist.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <ProductCard product={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Promo Banner */}
        <footer className="mt-32 relative overflow-hidden bg-slate-950 rounded-[4rem] p-12 md:p-20 text-center text-white">
          <Zap className="absolute left-10 top-10 w-32 h-32 text-indigo-500/5 -rotate-12" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
              ¿Listo para el siguiente nivel?
            </h3>
            <p className="text-slate-400 font-medium text-lg">
              Nuevos lanzamientos cada martes. Mantén tu lista actualizada para recibir alertas de stock.
            </p>
            <div className="pt-4">
              <Link href="/products">
                <Button className="bg-white text-slate-900 hover:bg-indigo-500 hover:text-white rounded-2xl px-12 h-14 font-black uppercase italic tracking-widest transition-all">
                  Ver Novedades
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px]" />
        </footer>
      </div>
    </div>
  );
}

const WishlistLoading = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4">
    <Loader2 className="h-12 w-12 animate-spin text-indigo-600" strokeWidth={3} />
    <span className="text-[10px] font-black uppercase italic tracking-[0.3em] text-slate-400">
      Cargando Favoritos
    </span>
  </div>
);