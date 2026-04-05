// src/components/hero/HeroSlideContent.tsx
"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { HeroSlide } from "@/types/types";

export const HeroSlideContent = ({ slide }: { slide: HeroSlide }) => {
  return (
    <div className="container relative z-10 mx-auto flex h-full items-center px-6 lg:px-12">
      <div className="max-w-3xl space-y-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.4em] text-indigo-300 border border-indigo-500/30">
            {slide.tag || "Novedad 2026"}
          </span>
          
          <h1 className="mt-6 text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.85] italic uppercase">
            {slide.title.split(" ").map((word, i) => (
              <span key={i} className={i % 2 !== 0 ? "text-indigo-500" : ""}>
                {word}{" "}
              </span>
            ))}
          </h1>
          
          <p className="mt-6 text-xl text-slate-300 max-w-lg font-medium leading-relaxed">
            {slide.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex gap-4"
        >
          <Link
            href={slide.link}
            className="group flex items-center gap-3 bg-white px-10 py-5 rounded-2xl text-black font-black uppercase text-xs tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-2xl shadow-indigo-500/20 active:scale-95"
          >
            Comprar ahora
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};