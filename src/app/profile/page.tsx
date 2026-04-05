// app/profile/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  Package,
  LogOut,
  Plus,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddressModal } from "@/components/profile/AddressModal";
import { AddressCard } from "@/components/profile/AddressCard";
import { Address } from "@/types/types";
import Link from "next/link";

export default function ProfilePage() {
  const {
    user,
    addresses,
    logout,
    deleteAddress,
    addAddress,
    updateAddress,
    setDefaultAddress,
    isLoading,
    orders,
  } = useUser();

  const [modal, setModal] = useState<{ open: boolean; data: Address | null }>({
    open: false,
    data: null,
  });

  if (isLoading) return <ProfileLoader />;
  if (!user) return <NoSessionState />;

  const handleSaveAddress = (data: Omit<Address, "id" | "isDefault">) => {
    modal.data ? updateAddress(modal.data.id, data) : addAddress(data);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      {/* 1. Profile Header */}
      <header className="relative overflow-hidden bg-slate-950 rounded-[3.5rem] p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative h-40 w-40 rounded-[2.5rem] overflow-hidden border-4 border-white/10 rotate-3">
            <Image
              src={user.image}
              alt={user.username}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <span className="inline-block px-4 py-1 bg-indigo-500 text-[10px] font-black uppercase italic rounded-full">
              {user.role} Member
            </span>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">
              {user.firstName}{" "}
              <span className="text-indigo-500">{user.lastName}</span>
            </h1>
            <p className="text-slate-400 font-bold tracking-widest text-sm uppercase">
              @{user.username} // {user.email}
            </p>
          </div>

          <Button
            onClick={logout}
            variant="outline"
            className="rounded-2xl border-white/10 bg-white/5 hover:bg-rose-500 hover:border-rose-500 text-white font-black uppercase italic h-16 px-8 transition-all"
          >
            <LogOut className="mr-2" size={20} /> Salir
          </Button>
        </div>
      </header>

      {/* 2. Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LADO IZQUIERDO: Direcciones y Configuración (Col 4) */}
        <aside className="lg:col-span-4 space-y-6">
          <section className="space-y-6">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
              <MapPin className="text-indigo-600" size={24} /> Direcciones
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-4">
                {addresses.length > 0 ? (
                  addresses.map((addr) => (
                    <AddressCard
                      key={addr.id}
                      address={addr}
                      onEdit={() => setModal({ open: true, data: addr })}
                      onDelete={deleteAddress}
                      onSetDefault={setDefaultAddress}
                    />
                  ))
                ) : (
                  <EmptyState
                    title="No hay registros"
                    desc="Tu lista de direcciones está vacía."
                    icon={<MapPin />}
                    small
                  />
                )}
              </div>
              <Button
                onClick={() => setModal({ open: true, data: null })}
                className="rounded-2xl bg-slate-950 hover:bg-indigo-600 h-12 px-6 shadow-xl w-full"
              >
                <Plus size={20} className="mr-2" /> Nueva Dirección
              </Button>
            </div>
          </section>
        </aside>

        {/* LADO DERECHO: Historial de Compras (Col 8) */}
        <main className="lg:col-span-8 space-y-6">
          <Card className="p-8 md:p-10 rounded-[3.5rem] bg-white border-slate-100 shadow-2xl shadow-slate-200/50">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                  <Package className="text-indigo-600" size={32} /> Mi Historial
                </h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                  {orders.length} pedidos realizados hasta la fecha
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="group flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
                  >
                    {/* Preview de Imágenes (mini stack) */}
                    <div className="flex -space-x-4">
                      {order.items.slice(0, 3).map((item: any, i: number) => (
                        <div
                          key={i}
                          className="h-16 w-16 rounded-2xl border-4 border-white bg-white shadow-sm overflow-hidden relative"
                        >
                          <Image
                            src={item.product.thumbnail}
                            alt="prod"
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                          #{order.id.slice(-8)}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {order.date}
                        </span>
                      </div>
                      <p className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">
                        {order.itemsCount} Producto
                        {order.itemsCount > 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                      <p className="text-xl font-black text-slate-900 tracking-tighter">
                        ${order.total.toLocaleString("es-CL")}
                      </p>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase italic">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="Sin compras"
                  desc="Tus pedidos aparecerán aquí"
                  icon={<Package size={40} />}
                />
              )}
            </div>
          </Card>
        </main>
      </div>

      <AddressModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, data: null })}
        onSave={handleSaveAddress}
        addressToEdit={modal.data}
      />
    </div>
  );
}

// Sub-componentes internos de estado
const ProfileLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
    <Loader2
      className="h-12 w-12 animate-spin text-indigo-600"
      strokeWidth={3}
    />
    <p className="text-slate-400 font-black uppercase italic tracking-[0.3em] text-[10px]">
      Sincronizando Perfil...
    </p>
  </div>
);

const NoSessionState = () => (
  <div className="p-20 text-center flex flex-col items-center gap-6">
    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
      <ShieldCheck size={40} />
    </div>
    <h2 className="text-3xl font-black uppercase italic text-slate-900">
      Acceso Restringido
    </h2>
    <Button
      asChild
      className="rounded-2xl bg-indigo-600 px-10 h-16 font-black uppercase italic shadow-xl shadow-indigo-200"
    >
      <Link href="/login">Identificarse</Link>
    </Button>
  </div>
);

const EmptyState = ({ title, desc, icon, small = false }: any) => (
  <div
    className={`flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-white/50 ${small ? "py-8" : "py-16 col-span-full"}`}
  >
    <div className="text-slate-200 mb-4">{icon}</div>
    <p className="text-slate-900 font-black uppercase italic text-xs tracking-tighter">
      {title}
    </p>
    <p className="text-slate-400 text-[10px] uppercase font-bold mt-1 tracking-widest">
      {desc}
    </p>
  </div>
);
