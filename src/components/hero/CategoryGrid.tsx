"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import Tittles from "./Tittles";

const FEATURED_CATEGORIES = [
  {
    name: "Muebles",
    slug: "furniture",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1170&auto=format&fit=crop",
  },
  {
    name: "Belleza",
    slug: "beauty",
    image:
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1170&auto=format&fit=crop",
  },
  {
    name: "Fragancias",
    slug: "fragrances",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1170&auto=format&fit=crop",
  },
];

const POSTER_CATEGORIES = [
  {
    name: "Smartphones",
    slug: "smartphones",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
    desc: "Última generación",
  },
  {
    name: "Laptops",
    slug: "laptops",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop",
    desc: "Potencia Pro",
  },
  {
    name: "Relojes",
    slug: "mens-watches",
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop",
    desc: "Elegancia eterna",
  },
  {
    name: "Gafas de Sol",
    slug: "sunglasses",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop",
    desc: "Estilo Verano",
  },
  {
    name: "Automotriz",
    slug: "vehicle",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop",
    desc: "Accesorios",
  },
  {
    name: "Zapatos",
    slug: "mens-shoes",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    desc: "Pisa fuerte",
  },
];

export const CategoryGrid = () => {
  return (
    <section className="container mx-auto space-y-8">
      {/* Cabecera */}
      <div className="flex items-end justify-between">
        <Tittles title="Populares" badge="Categorías" />
      </div>

      {/* 1. Fila Superior (Estilo Bento - 3 columnas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[220px]">
        {FEATURED_CATEGORIES.map((cat, index) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group relative overflow-hidden bg-slate-100 shadow-sm"
          >
            <Link
              href={`/products?category=${cat.slug}`}
              className="block h-full w-full"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl font-black text-white">{cat.name}</h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* 2. Fila Inferior (Estilo Poster - 6 columnas) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {POSTER_CATEGORIES.map((cat, index) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 + 0.3 }}
            className="group relative aspect-3/4 overflow-hidden bg-slate-100 shadow-sm"
          >
            <Link
              href={`/products?category=${cat.slug}`}
              className="block h-full w-full"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 16vw"
              />
              {/* Overlay Oscuro Sutil */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

              {/* Contenido del Poster */}
              <div className="absolute inset-0 p-4 flex flex-col justify-end text-center">
                <p className="text-[9px] uppercase tracking-widest text-indigo-300 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {cat.desc}
                </p>
                <h3 className="text-sm md:text-base font-bold text-white tracking-tight">
                  {cat.name}
                </h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
