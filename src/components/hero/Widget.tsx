import { ShieldCheck } from "lucide-react";
import React from "react";

export const Widget = () => {
  return (
    <div className="p-8 rounded-[3rem] bg-indigo-600 text-white shadow-xl shadow-indigo-200">
      <ShieldCheck className="mb-4" size={32} />
      <h4 className="text-lg font-black uppercase italic tracking-tighter">
        Compra Segura
      </h4>
      <p className="text-indigo-100 text-[10px] font-bold uppercase leading-relaxed mt-2 tracking-widest">
        Tus datos están protegidos con encriptación de nivel bancario a través
        de Mercado Pago.
      </p>
    </div>
  );
};
