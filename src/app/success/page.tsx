"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Package, ReceiptText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCLP } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Order } from "@/types/types";

export default function SuccessPage() {
  const { cart, clearCart, totalPrice } = useCart();
  const { processPurchase } = useUser();
  const searchParams = useSearchParams();

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current || cart.length === 0) return;

    const processOrder = async () => {
      try {
        const paymentId =
          searchParams.get("payment_id") || `NC-TEMP-${Date.now()}`;

        const newOrder = processPurchase(cart, totalPrice, paymentId);
        setConfirmedOrder(newOrder);

        hasProcessed.current = true;
        clearCart();

        window.history.replaceState({}, "", "/success");
      } catch (error) {
        console.error("Error al procesar la compra:", error);
      }
    };

    processOrder();
  }, [cart, processPurchase, clearCart, totalPrice, searchParams]);

  if (!confirmedOrder) return <SuccessSkeleton />;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-slate-200/60 text-center mb-6">
          <SuccessHeader />

          {/* Resumen de Productos */}
          <div className="bg-slate-50 rounded-3xl p-6 text-left mb-8 border border-slate-100">
            <div className="flex items-center gap-2 mb-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
              <Package size={14} /> <span>Artículos Adquiridos</span>
            </div>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {confirmedOrder.items.map((item, idx) => (
                <OrderItem key={`${item.product.id}-${idx}`} item={item} />
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-500 uppercase">
                Total Pagado
              </span>
              <span className="text-2xl font-black text-indigo-600 tracking-tighter">
                {formatCLP(confirmedOrder.total)}
              </span>
            </div>
          </div>

          <OrderFooter paymentId={confirmedOrder.id} />
        </div>

        <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          E-commerce Demo Portafolio • 2026
        </p>
      </motion.div>
    </div>
  );
}

// --- SUB-COMPONENTES (Legibilidad y Mantenibilidad) ---

const SuccessHeader = () => (
  <>
    <div className="mb-6 flex justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center text-indigo-600"
      >
        <CheckCircle2 size={40} strokeWidth={2.5} />
      </motion.div>
    </div>
    <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase mb-2">
      ¡Pedido <span className="text-indigo-500">Confirmado</span>!
    </h1>
    <p className="text-slate-500 font-medium mb-8">
      Gracias por tu compra. Tu transacción se completó con éxito.
    </p>
  </>
);

const OrderItem = ({ item }: { item: any }) => (
  <div className="flex items-center gap-4">
    <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 p-1 shrink-0 relative overflow-hidden">
      <Image
        src={item.product.thumbnail || item.product.images[0]}
        alt={item.product.title}
        fill
        className="object-contain"
      />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-slate-800 truncate">
        {item.product.title}
      </p>
      <p className="text-xs text-slate-400 font-medium">
        Cantidad: {item.quantity}
      </p>
    </div>
    <p className="text-sm font-black text-slate-900">
      {formatCLP(item.product.price * 850 * item.quantity)}
    </p>
  </div>
);

const OrderFooter = ({ paymentId }: { paymentId: string }) => (
  <>
    <div className="flex flex-col items-center gap-2 mb-10">
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-[10px] font-mono text-slate-500 uppercase tracking-tight">
        <ReceiptText size={12} /> Ref: {paymentId}
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Link href="/" className="w-full">
        <Button className="w-full bg-slate-900 hover:bg-black text-white rounded-2xl h-14 font-bold shadow-lg transition-all active:scale-95">
          Volver a la tienda
        </Button>
      </Link>
      <Link href="/profile" className="w-full">
        <Button
          variant="outline"
          className="w-full border-slate-200 text-slate-600 rounded-2xl h-14 font-bold hover:bg-slate-50 transition-all active:scale-95"
        >
          Mis Pedidos <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  </>
);

const SuccessSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="animate-pulse text-slate-400 font-black uppercase italic tracking-widest text-xs">
        Validando pago...
      </p>
    </div>
  </div>
);
