"use client";
import { CreditCard, Headphones, ShieldCheck, TruckIcon } from "lucide-react";
import { motion } from "framer-motion";

const BENEFITS = [
  {
    icon: <TruckIcon className="h-6 w-6" />,
    title: "Envío Gratis",
    desc: "En compras sobre $50.000",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Compra Segura",
    desc: "Protección al comprador",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: <Headphones className="h-6 w-6" />,
    title: "Atención 24/7",
    desc: "Soporte dedicado",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: "Pago Seguro",
    desc: "MercadoPago integrado",
    color: "bg-orange-50 text-orange-600",
  },
];

export const BenefitsSection = () => {
  return (
    <section className="py-10 border-y border-slate-100 bg-white/50 backdrop-blur-sm rounded-[2.5rem]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-10">
        {BENEFITS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-5 group cursor-default"
          >
            <div
              className={`p-4 rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${item.color}`}
            >
              {item.icon}
            </div>
            <div>
              <h3 className="font-black text-slate-900 uppercase tracking-tighter italic text-sm">
                {item.title}
              </h3>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-tight">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
