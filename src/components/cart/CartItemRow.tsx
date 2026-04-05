// src/components/cart/CartItemRow.tsx
import { Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { CartItem } from "@/types/types";
import { formatCLP, convertUSDtoCLP } from "@/lib/utils";

interface Props {
  item: CartItem;
  onUpdateQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}

export const CartItemRow = ({ item, onUpdateQty, onRemove }: Props) => {
  const unitPrice = convertUSDtoCLP(item.product.price);

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-all">
      <div className="relative w-40 h-40 bg-slate-50 rounded-2xl shrink-0 p-2 border border-slate-100">
        <Image
          src={item.product.thumbnail}
          alt={item.product.title}
          fill
          className="object-contain"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between py-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {item.product.title}
            </h3>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">
              {formatCLP(unitPrice)}
            </p>
          </div>
          <button
            onClick={() => onRemove(item.product.id)}
            className="text-slate-300 hover:text-rose-500 p-2 transition-colors rounded-full hover:bg-rose-50"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
            <button
              onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white transition-all disabled:opacity-30"
            >
              <Minus size={16} />
            </button>
            <span className="w-10 text-center font-bold">{item.quantity}</span>
            <button
              onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
              disabled={item.quantity >= item.product.stock}
              className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white transition-all"
            >
              <Plus size={16} />
            </button>
          </div>
          <p className="text-xl font-black text-indigo-600 tracking-tighter">
            {formatCLP(unitPrice * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
};
