"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Heart, Zap } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatCLP, convertUSDtoCLP } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isLoaded,
  } = useCart();
  const router = useRouter();

  const { products: allProducts } = useProducts(20);
  const relatedProducts = allProducts.slice(0, 6);
  const flashDeals = allProducts
    .filter(p => p.discountPercentage > 10)
    .slice(0, 6);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/60 mb-8">
            <ShoppingBag className="mx-auto h-20 w-20 text-slate-200 mb-4" />
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2 italic uppercase">
              Tu carrito está vacío
            </h1>
            <p className="text-slate-500 mb-8 font-medium">
              Parece que aún no has elegido tu próximo gadget favorito.
            </p>
            <Link href="/">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 h-14 w-full text-base font-bold shadow-lg shadow-indigo-200">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Explorar Productos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shipping = totalPrice >= 50000 ? 0 : 5000;
  const finalTotal = totalPrice + shipping;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic mb-2">
            Mi <span className="text-indigo-600">Carrito</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Tienes {totalItems} artículo{totalItems !== 1 ? "s" : ""} listo{totalItems !== 1 ? "s" : ""}{" "}
            para despachar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => {
              const unitPriceCLP = convertUSDtoCLP(item.product.price);
              const subtotalItemCLP = unitPriceCLP * item.quantity;

              return (
                <div
                  key={item.product.id}
                  className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 flex flex-col sm:flex-row gap-6 transition-all hover:shadow-md"
                >
                  <div className="relative w-full sm:w-40 aspect-square bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100 p-2">
                    <Image
                      src={item.product.images?.[0] ?? item.product.thumbnail}
                      alt={item.product.title}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Link
                          href={`/product/${item.product.id}`}
                          className="hover:text-indigo-600 transition-colors"
                        >
                          <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">
                            {item.product.title}
                          </h3>
                        </Link>
                        <p className="text-2xl font-black text-slate-900 tracking-tighter">
                          {formatCLP(unitPriceCLP)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="cursor-pointer text-slate-300 hover:text-rose-500 p-2 transition-colors rounded-full hover:bg-rose-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="cursor-pointer h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-slate-600 transition-all disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" strokeWidth={3} />
                        </button>
                        <span className="w-10 text-center font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="cursor-pointer h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-slate-600 transition-all disabled:opacity-30"
                          disabled={item.quantity >= (item.product.stock ?? 99)}
                        >
                          <Plus className="h-4 w-4" strokeWidth={3} />
                        </button>
                      </div>

                      <p className="text-xl font-black text-indigo-600 tracking-tighter">
                        {formatCLP(subtotalItemCLP)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-center pt-4">
              <button
                onClick={clearCart}
                className="cursor-pointer text-slate-400 hover:text-slate-600 text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Vaciar Carrito
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 sticky top-24 text-black">
              <h2 className="text-xl font-black uppercase tracking-tighter mb-8 italic">
                Resumen del Pedido
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Subtotal</span>
                  <span className="text-slate-700">{formatCLP(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Envío Estimado</span>
                  <span
                    className={
                      shipping === 0
                        ? "text-emerald-400 font-bold"
                        : "text-slate-700"
                    }
                  >
                    {shipping === 0 ? "GRATIS" : formatCLP(shipping)}
                  </span>
                </div>

                {shipping === 0 ? (
                  <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl text-xs font-bold border border-emerald-500/20 text-center">
                    ✓ ¡Tienes envío gratis!
                  </div>
                ) : (
                  <div className="bg-indigo-500/10 text-indigo-700 p-3 rounded-xl text-xs font-bold border border-indigo-500/20 text-center">
                    Agrega {formatCLP(50000 - totalPrice)} más para envío gratis
                  </div>
                )}

                <div className="border-t border-white/10 pt-6 flex justify-between items-baseline">
                  <span className="text-sm uppercase tracking-widest font-bold">
                    Total Final
                  </span>
                  <span className="text-3xl font-black text-indigo-400 tracking-tighter">
                    {formatCLP(finalTotal)}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => router.push("/checkout")}
                className="w-full bg-black hover:bg-black text-white h-16 rounded-2xl text-lg font-black uppercase tracking-tighter transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
              >
                Finalizar Compra
              </Button>

              <p className="text-[10px] text-center text-slate-500 mt-6 uppercase tracking-widest font-bold">
                Transacción segura y encriptada
              </p>
            </div>
          </div>
        </div>

        {totalItems > 0 && (
          <div className="mt-24 space-y-20">

            {/* 1. SLIDER: PRODUCTOS RELACIONADOS */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  <Heart className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
                    Podría <span className="text-indigo-600">gustarte</span>
                  </h2>
                  <p className="text-slate-500 text-sm font-medium">Basado en tu selección actual</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {relatedProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* 2. SLIDER: DESCUENTOS RELÁMPAGO */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 animate-pulse">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
                    Ofertas <span className="text-orange-600">Relámpago</span>
                  </h2>
                  <p className="text-slate-500 text-sm font-medium">¡Solo por tiempo limitado!</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {flashDeals.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative"
                  >
                    {/* Badge extra de oferta */}
                    <div className="absolute top-[-15] right-0 z-10 bg-orange-600 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter">
                      Flash Deal
                    </div>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </section>

          </div>
        )}
      </div>
    </div>
  );
}
