import { CheckCircle2, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCLP } from "@/lib/utils";
import { CartItem } from "@/types/types";

interface OrderSummaryProps {
  cart: CartItem[];
  total: number;
  loading: boolean;
  isFormValid: boolean;
  onPay: () => void;
}

export const OrderSummary = ({ cart, total, loading, isFormValid, onPay }: OrderSummaryProps) => (
  <aside className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl sticky top-10 overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16" />

    <h2 className="text-xl font-black uppercase italic mb-8 flex items-center gap-2">
      <CheckCircle2 className="text-indigo-400" /> Resumen de Compra
    </h2>

    <div className="space-y-4 mb-8 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
      {cart.map((item) => (
        <div key={item.product.id} className="flex justify-between items-center text-sm">
          <span className="text-slate-400 font-medium line-clamp-1 flex-1 mr-4">
            {item.quantity}x {item.product.title}
          </span>
          <span className="font-bold tabular-nums">
            {formatCLP(item.product.price * 850 * item.quantity)}
          </span>
        </div>
      ))}
    </div>

    <div className="pt-6 border-t border-white/10 flex justify-between items-baseline">
      <span className="text-2xl font-black uppercase italic tracking-tighter">Total</span>
      <span className="text-4xl font-black text-indigo-400 tracking-tighter tabular-nums">
        {formatCLP(total)}
      </span>
    </div>

    <div className="mt-8 space-y-4">
      <Button
        onClick={onPay}
        disabled={loading}
        className={`w-full h-20 rounded-[2rem] text-xl font-black uppercase italic transition-all shadow-xl flex gap-3 group ${isFormValid
            ? "bg-indigo-500 hover:bg-white hover:text-indigo-600 text-white"
            : "bg-slate-800 text-slate-500"
          }`}
      >
        {loading ? "Procesando..." : <>Pagar Ahora <CreditCard /></>}
      </Button>

      {!isFormValid && (
        <p className="text-[10px] text-center text-rose-400 font-bold uppercase tracking-widest animate-pulse">
          Completa los campos en rojo
        </p>
      )}
    </div>

    <div className="flex items-center justify-center gap-4 opacity-30 grayscale pt-4">
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-tight text-slate-300">
          Pagos procesados por <br />
          <span className="text-[12px] text-slate-300">Mercado Pago</span>
        </p>
      </div>
    </div>
  </aside>
);