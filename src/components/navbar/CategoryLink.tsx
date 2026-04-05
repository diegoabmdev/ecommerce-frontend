"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Category } from "@/types/types";

interface CategoryLinkProps {
  category: Category;
}

export const CategoryLink = ({ category }: CategoryLinkProps) => {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group relative flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-indigo-50/80 transition-all duration-300"
    >
      <div className="flex flex-col">
        <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 capitalize transition-colors">
          {category.name}
        </span>
        <span className="text-[10px] text-slate-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Explorar colección
        </span>
      </div>

      <motion.div
        initial={{ x: -10, opacity: 0 }}
        whileHover={{ x: 0, opacity: 1 }}
        className="text-indigo-600"
      >
        <ChevronRight className="w-4 h-4" />
      </motion.div>

      <div className="absolute left-0 w-1 h-0 bg-indigo-600 rounded-full group-hover:h-6 transition-all duration-300 top-1/2 -translate-y-1/2" />
    </Link>
  );
};
