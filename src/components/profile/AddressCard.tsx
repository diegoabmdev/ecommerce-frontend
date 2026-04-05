// components/profile/AddressCard.tsx
import { MapPin, Trash2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Address } from "@/types/types";

interface AddressCardProps {
  address: Address;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export const AddressCard = ({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) => (
  <div className="p-6 rounded-[2rem] bg-white border border-slate-100 relative group transition-all hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50">
    <div className="cursor-pointer space-y-1" onClick={onEdit}>
      <p className="font-black uppercase text-[10px] tracking-[0.2em] text-indigo-600">
        {address.name}
      </p>
      <p className="text-base text-slate-700 font-bold leading-tight">
        {address.address}
      </p>
      <p className="text-xs text-slate-400 font-medium">
        {address.city}, {address.state} • {address.postalCode}
      </p>
    </div>

    <div className="flex items-center gap-2 mt-4">
      {address.isDefault ? (
        <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[9px] font-black uppercase px-3 py-1 flex gap-1 items-center">
          <CheckCircle2 size={10} /> Principal
        </Badge>
      ) : (
        <button
          onClick={() => onSetDefault(address.id)}
          className="text-[9px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-colors tracking-tighter"
        >
          Marcar como principal
        </button>
      )}
    </div>

    {!address.isDefault && (
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(address.id); }}
        className="absolute top-4 right-4 p-2.5 bg-rose-50 rounded-xl text-rose-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
      >
        <Trash2 size={14} />
      </button>
    )}
  </div>
);