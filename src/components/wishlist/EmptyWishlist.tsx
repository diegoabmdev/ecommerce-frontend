// components/wishlist/EmptyWishlist.tsx
import { Heart, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const EmptyWishlist = () => (
  <div className="min-h-[70vh] flex items-center justify-center px-4">
    <div className="text-center max-w-md w-full">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
        <div className="relative mx-auto w-24 h-24 mb-8">
          <Heart className="h-24 w-24 text-slate-50 fill-slate-100" />
          <Sparkles className="absolute -top-2 -right-2 h-10 w-10 text-indigo-400 animate-pulse" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-3 italic uppercase">
          Lista Desierta
        </h1>
        <p className="text-slate-400 mb-10 font-medium text-sm">
          Tus favoritos tecnológicos aparecerán aquí cuando los marques con un
          corazón.
        </p>
        <Link href="/products">
          <Button className="bg-indigo-600 hover:bg-slate-950 text-white rounded-2xl px-10 h-16 w-full font-black uppercase italic transition-all group">
            <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Explorar Tech
          </Button>
        </Link>
      </div>
    </div>
  </div>
);
