"use client";

import { Info, ExternalLink } from "lucide-react";

export const SandboxInfo = () => {
  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="bg-indigo-500 p-2.5 rounded-xl text-white shadow-sm shrink-0">
          <Info size={20} />
        </div>

        <div className="space-y-1">
          <h3 className="text-indigo-900 font-black uppercase italic text-xs tracking-tighter">
            Modo de Prueba Activo
          </h3>
          <p className="text-indigo-700/70 text-[10px] leading-relaxed font-bold uppercase">
            Usa las tarjetas de prueba oficiales de Mercado Pago para simular transacciones exitosas o rechazadas.
          </p>
          
          <a
            href="https://www.mercadopago.cl/developers/es/docs/vtex/resources/test-cards"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-indigo-600 font-black text-[10px] uppercase tracking-wider hover:text-indigo-800 transition-colors pt-2 group"
          >
            Obtener números de tarjeta 
            <ExternalLink size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};