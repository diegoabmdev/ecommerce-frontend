// src/components/navbar/MegaMenu.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LayoutGrid, Loader2, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Category } from "@/types/types";
import { menuVariants, transitions } from "@/lib/animations";
import { MegaMenuBanner } from "./MegaMenuBanner";
import { CategoryLink } from "./CategoryLink";

// Definición de Props
interface MegaMenuProps {
  categories: Category[];
  loading: boolean;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
}

export const MegaMenu = ({
  categories,
  loading,
  isHovered,
  setIsHovered,
}: MegaMenuProps) => {
  return (
    <div
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        variant="ghost"
        className={`h-full rounded-none border-b-2 transition-all font-black gap-2 px-6 ${
          isHovered
            ? "border-indigo-600 bg-indigo-50/50 text-indigo-600"
            : "border-transparent text-foreground/70"
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        Categorías
        <motion.div
          animate={{ rotate: isHovered ? 180 : 0 }}
          transition={transitions.smooth}
        >
          <ChevronDown className="w-3 h-3" />
        </motion.div>
      </Button>

      <AnimatePresence>
        {isHovered && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-36 bg-black/20 backdrop-blur-sm z-50 pointer-events-none"
            />

            {/* Panel del Menú */}
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={transitions.smooth}
              className="absolute top-full left-0 w-200 bg-white border border-gray-100 shadow-2xl rounded-b-[2.5rem] z-60 overflow-hidden"
            >
              <div className="flex">
                <div className="w-1/2 p-8 border-r border-gray-50">
                  <header className="flex items-center gap-2 mb-6 text-indigo-600">
                    <Sparkles className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Explorar
                    </span>
                  </header>

                  {loading ? (
                    <div className="flex py-10 justify-center">
                      <Loader2 className="animate-spin text-indigo-600" />
                    </div>
                  ) : (
                    <nav className="grid grid-cols-1 gap-1">
                      {categories.slice(0, 8).map((cat: Category) => (
                        <CategoryLink key={cat.slug} category={cat} />
                      ))}
                    </nav>
                  )}
                </div>
                <MegaMenuBanner />
              </div>
              <footer className="bg-indigo-600 py-3 text-center text-[10px] font-bold text-indigo-100 uppercase tracking-widest">
                Envío gratis por compras sobre $50.000
              </footer>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
