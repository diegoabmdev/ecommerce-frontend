"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Lógica para mostrar el botón solo después de bajar 400px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-99 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/80 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-indigo-600 hover:shadow-indigo-500/40 cursor-pointer"
          aria-label="Volver arriba"
        >
          <ArrowUp className="h-6 w-6" strokeWidth={3} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};