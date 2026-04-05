"use client";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/product/ProductCard";
import { Timer } from "lucide-react";
import { useState, useEffect } from "react";
import Tittles from "./Tittles";
import { motion } from "framer-motion";

export const FlashSales = () => {
  const { products, loading } = useProducts();
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59, s: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = products
    .filter((p) => p.discountPercentage > 10)
    .slice(0, 6);

  if (loading) return <div className="h-80 w-full bg-slate-100 animate-pulse rounded-[2.5rem]" />;

  return (
    <section className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <Tittles title="Relámpago" badge="Ofertas" />

        <div className="flex items-center gap-4 bg-slate-950 p-2 pl-6 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Termina en:</span>
            <div className="flex gap-2 text-2xl font-black font-mono text-white italic">
              <span>{String(timeLeft.h).padStart(2, "0")}</span>:
              <span>{String(timeLeft.m).padStart(2, "0")}</span>:
              <span className="text-indigo-500">{String(timeLeft.s).padStart(2, "0")}</span>
            </div>
          </div>
          <div className="bg-indigo-600 p-3 rounded-2xl">
            <Timer className="w-6 h-6 text-white animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {flashProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="relative"
          >
            <div className="absolute -top-2 -left-2 z-20 bg-rose-600 text-white text-[10px] font-black px-3 py-1 rounded-lg shadow-lg rotate-[-5deg]">
              -{Math.round(product.discountPercentage)}%
            </div>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};