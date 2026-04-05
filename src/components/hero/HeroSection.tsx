// src/components/hero/HeroSection.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { HeroSlideContent } from "./HeroSlideContent";
import { HeroSlide } from "@/types/types";

const SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: "iPhone 15 Pro",
    tag: "Apple Specialist",
    subtitle:
      "Titanio de grado aeroespacial. El chip A17 Pro llega para cambiarlo todo.",
    image:
      "https://images.unsplash.com/photo-1695619575474-9b45e37bc1e6?q=80&w=2000&auto=format&fit=crop",
    color: "from-slate-950 via-slate-900 to-indigo-950",
    link: "/products?category=smartphones",
  },
  {
    id: 2,
    title: "MacBook Air M3",
    tag: "Poder Portátil",
    subtitle:
      "Súper ligera. Súper potente. Súper chip M3 para una eficiencia nunca antes vista.",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2000&auto=format&fit=crop",
    color: "from-blue-950 via-slate-950 to-slate-950",
    link: "/products?category=laptops",
  },
  {
    id: 3,
    title: "Smart TV 70'",
    tag: "Smart TV",
    subtitle:
      "Súper ligera. Súper potente. Súper chip M3 para una eficiencia nunca antes vista.",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    color: "from-blue-950 via-slate-950 to-slate-950",
    link: "/products?category=laptops",
  },
];

export const Hero = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative h-[60vh] min-h-150 w-full overflow-hidden bg-slate-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute inset-0 bg-linear-to-br ${SLIDES[current].color}`}
        >
          {/* Background Image with Parallax effect focus */}
          <div className="absolute inset-0 select-none">
            <Image
              src={SLIDES[current].image}
              alt={SLIDES[current].title}
              fill
              priority
              className="object-cover opacity-50 mix-blend-luminosity lg:mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />
          </div>

          <HeroSlideContent slide={SLIDES[current]} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls - Minimalist */}
      <div className="absolute bottom-12 right-12 z-20 flex items-center gap-6">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="group relative h-12 w-2 focus:outline-none"
            >
              <div
                className={`absolute bottom-0 w-full rounded-full transition-all duration-500 ${
                  current === i
                    ? "h-full bg-indigo-500"
                    : "h-2 bg-white/20 group-hover:bg-white/40"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-1">
          <button
            onClick={prevSlide}
            className="p-4 hover:text-indigo-400 text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="w-px bg-white/10 my-2" />
          <button
            onClick={nextSlide}
            className="p-4 hover:text-indigo-400 text-white transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};
