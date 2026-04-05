// src/components/auth/AuthFormWrapper.tsx
"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface AuthFormWrapperProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  icon: LucideIcon;
}

export const AuthFormWrapper = ({ children, title, subtitle, icon: Icon }: AuthFormWrapperProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full max-w-137.5 mx-auto relative group"
  >
    {/* Efecto de resplandor de fondo */}
    <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-[4rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
    
    <div className="relative bg-white p-10 md:p-14 rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden">
      {/* Decoración geométrica interna */}
      <div className="absolute -right-10 -top-10 h-40 w-40 bg-slate-50 rounded-full" />
      
      <div className="relative z-10 flex flex-col items-center mb-12 text-center">
        <div className="h-16 w-16 bg-slate-950 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
          <Icon size={32} strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-950 leading-none">
          {title}
        </h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-4 bg-slate-50 px-4 py-1 rounded-full border border-slate-100">
          {subtitle}
        </p>
      </div>
      
      {children}
    </div>
  </motion.div>
);