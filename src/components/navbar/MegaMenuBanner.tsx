"use client";

import { motion } from "framer-motion";
import { Package, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { transitions } from "@/lib/animations";

export const MegaMenuBanner = () => {
  return (
    <div className="w-1/2 p-8 bg-slate-50/50 flex flex-col">
      <motion.div
        className="relative overflow-hidden rounded-[2rem] bg-indigo-600 p-8 text-white h-full flex flex-col justify-end group cursor-pointer"
        whileHover="hover"
      >
        {/* Decoración de fondo: Círculo de luz */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl group-hover:bg-indigo-400/30 transition-colors duration-500" />

        {/* Icono decorativo flotante */}
        <motion.div
          variants={{
            hover: {
              scale: 1.1,
              rotate: 5,
              x: 10,
              y: -10,
            },
          }}
          transition={transitions.spring}
          className="absolute -right-4 -top-4 text-white/10"
        >
          <Package size={160} strokeWidth={1} />
        </motion.div>

        {/* Contenido principal */}
        <div className="relative z-10 space-y-4">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em]"
          >
            Exclusivo Online
          </motion.span>

          <div className="space-y-1">
            <h4 className="text-2xl font-black leading-tight tracking-tighter">
              Nueva Colección <br />
              <span className="text-indigo-200">Tech 2026</span>
            </h4>
            <p className="text-indigo-100/80 text-sm font-medium max-w-50 leading-relaxed">
              Descubre lo último en gadgets con envíos en 24 horas.
            </p>
          </div>

          <Button
            size="sm"
            className="bg-white text-indigo-600 hover:bg-slate-100 rounded-xl font-black text-xs px-6 py-5 group/btn transition-all shadow-lg shadow-indigo-900/20"
          >
            VER CATÁLOGO
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>

        {/* Borde sutil de brillo en hover */}
        <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 rounded-[2rem] transition-colors duration-500" />
      </motion.div>
    </div>
  );
};
