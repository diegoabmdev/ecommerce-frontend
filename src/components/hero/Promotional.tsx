"use client";
import Link from "next/link";
import Image from "next/image";
import Tittles from "./Tittles";
import { motion } from "framer-motion";

export const Promotional = () => {
  return (
    <section className="space-y-8">
      <Tittles title="Destacadas" badge="Promociones" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-137.5">
        {/* Banner Principal - Izquierda (8 columnas) */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="lg:col-span-8 relative overflow-hidden group shadow-2xl shadow-indigo-500/10"
        >
          <Link href="/products?category=laptops" className="block h-full w-full">
            <Image
              src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1200"
              alt="Laptops"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent p-12 flex flex-col justify-end">
              <span className="text-indigo-400 font-black tracking-widest uppercase text-xs mb-4">Tecnología de Vanguardia</span>
              <h2 className="text-5xl md:text-7xl font-black text-white italic uppercase leading-[0.85] mb-8">
                Potencia tu <br /> Creatividad
              </h2>
              <div className="flex">
                <span className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  Explorar Colección →
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Banner Secundario - Derecha (4 columnas) */}
        <div className="lg:col-span-4 grid grid-rows-2 gap-6">
          {[
            { title: "Gourmet", cat: "groceries", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600" },
            { title: "Skincare", cat: "beauty", img: "https://images.unsplash.com/photo-1700107650012-36feae7e18ed?q=80&w=600" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="relative overflow-hidden group"
            >
              <Link href={`/products?category=${item.cat}`} className="block h-full w-full">
                <Image src={item.img} alt={item.title} fill className="object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-indigo-600/20 transition-colors" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-black text-white uppercase italic">{item.title}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};