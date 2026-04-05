"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { useProducts } from "@/hooks/useProducts"; // Usamos tu hook existente
import Image from "next/image";
import Link from "next/link";

export const SearchInput = ({ className }: { className?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Obtenemos todos los productos para filtrar localmente las sugerencias
  const { products, loading } = useProducts();

  // Filtrar sugerencias basadas en el query
  const suggestions =
    query.length > 1
      ? products
          .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5)
      : [];

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) params.set("search", query.trim());
    else params.delete("search");

    params.delete("page");
    router.push(`/product?${params.toString()}`);
  };

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`${className} relative`} ref={containerRef}>
      <form onSubmit={handleSearch} className="relative w-full group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
        <Input
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="¿Qué buscas hoy?"
          className="h-12 pl-12 pr-4 bg-muted/40 border-2 border-transparent focus-visible:border-indigo-500/30 rounded-2xl"
        />
        {loading && (
          <Loader2
            className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-slate-400"
            size={18}
          />
        )}
      </form>

      {/* DROPDOWN DE SUGERENCIAS */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2">
            {suggestions.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors group"
              >
                <div className="relative h-12 w-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600">
                    {product.title}
                  </p>
                  <p className="text-xs text-slate-400 uppercase font-black italic">
                    ${product.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <button
            onClick={() => handleSearch()}
            className="w-full p-3 bg-slate-50 text-xs font-black uppercase italic text-center text-slate-500 hover:text-indigo-600 transition-colors border-t border-slate-100"
          >
            Ver todos los resultados para "{query}"
          </button>
        </div>
      )}
    </div>
  );
};
