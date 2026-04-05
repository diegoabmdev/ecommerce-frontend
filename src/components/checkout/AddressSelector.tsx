"use client";

import { Address } from "@/types/types";
import { MapPin } from "lucide-react";

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddress: string;
  onSelect: (addr: Address) => void;
}

export const AddressSelector = ({
  addresses,
  selectedAddress,
  onSelect,
}: AddressSelectorProps) => {
  if (addresses.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 ml-2">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Tus direcciones guardadas
        </p>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {addresses.map((addr) => {
          const isSelected = selectedAddress === addr.address;

          return (
            <button
              key={addr.id}
              type="button"
              onClick={() => onSelect(addr)}
              className={`flex items-start gap-3 p-4 rounded-2xl border-2 transition-all text-left group relative overflow-hidden ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50/30 shadow-md"
                  : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm"
              }`}
            >
              <div
                className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? "border-indigo-600" : "border-slate-200"
                }`}
              >
                <div
                  className={`h-2.5 w-2.5 bg-indigo-600 rounded-full transition-transform duration-300 ${
                    isSelected ? "scale-100" : "scale-0"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <p className="font-bold text-sm text-slate-800 uppercase italic leading-none line-clamp-1">
                  {addr.address}
                </p>
                <div className="flex items-center gap-1">
                  <MapPin size={10} className="text-slate-400" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {addr.city}, {addr.country || "Chile"}
                  </p>
                </div>
              </div>
              {isSelected && (
                <div className="absolute top-0 right-0 p-2">
                  <div className="bg-indigo-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    Seleccionado
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
