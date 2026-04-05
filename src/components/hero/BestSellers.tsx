"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "../product/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import Tittles from "./Tittles";

export const BestSellers = () => {
  const { products, loading } = useProducts(18);
  const [currentIndex, setCurrentIndex] = useState(0);

  const ITEMS_PER_VIEW = 6;

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + ITEMS_PER_VIEW >= products.length ? 0 : prev + ITEMS_PER_VIEW,
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - ITEMS_PER_VIEW < 0
        ? Math.max(0, products.length - ITEMS_PER_VIEW)
        : prev - ITEMS_PER_VIEW,
    );
  };

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center text-slate-400 font-medium">
        Cargando productos estrella...
      </div>
    );

  return (
    <section className="bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Encabezado: Se mantienen tus estilos originales */}
        <div className="flex items-end justify-between mb-6">
          <Tittles title="Lo Más Vendidos" badge="Top 18" />

          <div className="flex gap-2">
            <Button
              onClick={prevSlide}
              variant="outline"
              className="rounded-full h-12 w-12 border-slate-200 hover:bg-white transition-all active:scale-90"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              onClick={nextSlide}
              variant="outline"
              className="rounded-full h-12 w-12 border-slate-200 hover:bg-white transition-all active:scale-90"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Contenedor del Slider */}
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <AnimatePresence mode="wait">
              {products
                .slice(currentIndex, currentIndex + ITEMS_PER_VIEW)
                .map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{
                      duration: 0.4,
                      delay: idx * 0.05,
                      ease: "easeOut",
                    }}
                  >
                    {/* Renderizado con tu ProductCard personalizada */}
                    <ProductCard product={product} />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Indicador de página (opcional) */}
        <div className="mt-8 flex justify-center gap-1">
          {Array.from({
            length: Math.ceil(products.length / ITEMS_PER_VIEW),
          }).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / ITEMS_PER_VIEW) === i
                  ? "w-8 bg-indigo-600"
                  : "w-2 bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
