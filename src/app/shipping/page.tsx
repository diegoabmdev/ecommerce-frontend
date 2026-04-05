"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { Search, Package, Calendar, CheckCircle2, ArrowLeft, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function TrackingPage() {
  const { orders } = useUser();
  const [searchId, setSearchId] = useState("");
  const [foundOrder, setFoundOrder] = useState<any>(null);
  const [error, setError] = useState(false);

  const handleTrack = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(false);
    
    const order = orders.find((o) => o.id === searchId.trim());
    
    if (order) {
      setFoundOrder(order);
    } else {
      setFoundOrder(null);
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold text-sm uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>
          <Truck className="w-8 h-8 text-indigo-600" />
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 mb-2">
            Rastrear Pedido
          </h1>
          <p className="text-slate-500 text-sm mb-8 font-medium">
            Ingresa el ID de tu pedido para conocer el estado actual y los detalles de tu compra.
          </p>

          {/* Buscador */}
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Ej: 12345"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all font-bold"
              />
            </div>
            <Button type="submit" className="h-full py-4 px-8 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black uppercase italic tracking-widest text-xs">
              Buscar Envío
            </Button>
          </form>

          {/* Resultado: Not Found */}
          {error && (
            <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold text-center">
              No encontramos ningún pedido con ese ID. Verifica el número e intenta de nuevo.
            </div>
          )}

          {/* Detalle del Pedido */}
          {foundOrder && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-slate-50 rounded-2xl mb-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado del Envío</p>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-xl font-black uppercase italic text-emerald-600">{foundOrder.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha de Compra</p>
                  <p className="font-bold text-slate-700 mt-1">{foundOrder.date}</p>
                </div>
              </div>

              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-2">Productos en el paquete</h3>
              <div className="space-y-3">
                {foundOrder.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50/50 transition-colors">
                    <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden border border-slate-100 shrink-0">
                      <Image src={item.product.thumbnail} alt={item.product.title} fill className="object-contain p-1" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{item.product.title}</h4>
                      <p className="text-xs text-slate-400 font-medium">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">${(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                <p className="text-sm font-bold text-slate-500 italic">Total pagado</p>
                <p className="text-2xl font-black text-indigo-600 italic">${foundOrder.total.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}