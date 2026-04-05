"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import { AuthInput } from "@/components/auth/AuthInput";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { MapPin, User, Truck, Phone, AlertCircle } from "lucide-react";
import { AddressSelector } from "@/components/checkout/AddressSelector";
import { SandboxInfo } from "@/components/checkout/SandboxInfo";

export default function CheckoutPage() {
  const { cart, totalPrice } = useCart();
  const { addresses } = useUser();
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const form = useCheckoutForm();

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  const handlePayment = async () => {
    if (!form.isFormValid) {
      form.markAllAsTouched();
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, shipping: form.shippingData }),
      });
      const { init_point } = await response.json();
      window.location.href = init_point;
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 md:py-20">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* LADO IZQUIERDO: FORMULARIO */}
        <div className="lg:col-span-7 space-y-8">
          <header className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
              <MapPin size={20} />
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Envío</h2>
          </header>

          <AddressSelector
            addresses={addresses}
            selectedAddress={form.shippingData.address}
            onSelect={(addr) => {
              form.handleInputChange("address", addr.address);
              form.handleInputChange("city", addr.city);
              form.setTouched(prev => ({ ...prev, address: true, city: true }));
            }}
          />

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <CheckoutField error={form.touched.fullName ? form.validation.fullName : null}>
              <AuthInput
                label="Nombre de quien recibe" icon={User}
                value={form.shippingData.fullName}
                onChange={(e) => form.handleInputChange("fullName", e.target.value)}
                onBlur={() => form.setTouched(p => ({ ...p, fullName: true }))}
                className={form.touched.fullName && form.validation.fullName ? "border-rose-500 bg-rose-50/30" : ""}
              />
            </CheckoutField>

            <CheckoutField error={form.touched.address ? form.validation.address : null}>
              <AuthInput
                label="Dirección de Entrega" icon={Truck}
                value={form.shippingData.address}
                onChange={(e) => form.handleInputChange("address", e.target.value)}
                onBlur={() => form.setTouched(p => ({ ...p, address: true }))}
                className={form.touched.address && form.validation.address ? "border-rose-500 bg-rose-50/30" : ""}
              />
            </CheckoutField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CheckoutField error={form.touched.city ? form.validation.city : null}>
                <AuthInput
                  label="Ciudad" icon={MapPin}
                  value={form.shippingData.city}
                  onChange={(e) => form.handleInputChange("city", e.target.value)}
                  onBlur={() => form.setTouched(p => ({ ...p, city: true }))}
                  className={form.touched.city && form.validation.city ? "border-rose-500 bg-rose-50/30" : ""}
                />
              </CheckoutField>

              <CheckoutField error={form.touched.phone ? form.validation.phone : null}>
                <AuthInput
                  label="Teléfono" icon={Phone}
                  value={form.shippingData.phone}
                  onChange={(e) => form.handlePhoneChange(e.target.value)}
                  onBlur={() => form.setTouched(p => ({ ...p, phone: true }))}
                  className={form.touched.phone && form.validation.phone ? "border-rose-500 bg-rose-50/30" : ""}
                />
              </CheckoutField>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: RESUMEN */}
        <div className="lg:col-span-5 space-y-6">
          <OrderSummary
            cart={cart} total={totalPrice} loading={loading}
            isFormValid={form.isFormValid} onPay={handlePayment}
          />
          <SandboxInfo />
        </div>
      </div>
    </div>
  );
}

const CheckoutField = ({ children, error }: { children: React.ReactNode, error: string | null }) => (
  <div className="space-y-1.5">
    {children}
    {error && (
      <p className="text-[10px] text-rose-500 font-black uppercase flex items-center gap-1 ml-5 italic animate-in fade-in slide-in-from-left-1">
        <AlertCircle size={11} strokeWidth={3} /> {error}
      </p>
    )}
  </div>
);