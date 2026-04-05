"use client";

import Link from "next/link";
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  Cpu,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollToTop } from "./ScrollToTop";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-950 text-slate-400 border-t border-white/3 overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="container mx-auto px-6">
        {/* 1. SECCIÓN NEWSLETTER (Bento Style) */}
        <div className="py-20">
          <div className="relative p-8 md:p-16 rounded-[3rem] bg-linear-to-b from-white/3 to-transparent border border-white/5 overflow-hidden">
            <Cpu className="absolute -right-10 -top-10 w-64 h-64 text-white/2 -rotate-12" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center lg:text-left">
                <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-4">
                  Únete a <span className="text-indigo-500">Nova Cart</span>
                </h3>
                <p className="text-slate-400 text-lg font-medium">
                  Recibe acceso anticipado a productos exclusivos y tecnología
                  de vanguardia.
                </p>
              </div>

              <div className="w-full max-w-md">
                <form className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="ACCESO@EMAIL.COM"
                    className="h-16 bg-white/3 border-white/8 rounded-2xl px-6 text-white placeholder:text-slate-600 focus:border-indigo-500 transition-all outline-none italic font-bold"
                  />
                  <Button className="h-16 rounded-2xl bg-white text-black hover:bg-indigo-500 hover:text-white px-8 font-black uppercase italic transition-all shrink-0">
                    Suscribirse
                  </Button>
                </form>
                <p className="text-[10px] text-slate-600 mt-4 uppercase tracking-[0.2em] font-bold text-center lg:text-left">
                  * Al suscribirte aceptas nuestra política de datos
                  encriptados.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 py-20 border-t border-white/5">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-8">
            <Link
              href="/"
              className="text-3xl font-black text-white tracking-tighter uppercase italic flex items-center gap-2"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <Store className={`w-8 h-8`} />
              </div>
              Nova<span className="text-indigo-500">Cart</span>
            </Link>
            <p className="text-base leading-relaxed font-medium">
              Curaduría de hardware premium para mentes creativas. Elevando el
              estándar digital desde 2024 con envíos globales y soporte técnico
              24/7.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="h-12 w-12 flex items-center justify-center bg-white/3 rounded-xl border border-white/5 text-slate-400 hover:text-white hover:bg-indigo-600/20 hover:border-indigo-500/50 transition-all"
                >
                  <Icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <FooterSection
            title="Explorar"
            links={[
              { label: "Smartphones", href: "/products?cat=smartphones" },
              { label: "Laptops & PC", href: "/products?cat=laptops" },
              { label: "Audio High-End", href: "/products?cat=audio" },
              { label: "Wearables", href: "/products?cat=wearables" },
            ]}
          />

          <FooterSection
            title="Soporte"
            links={[
              { label: "Tracking de Envío", href: "#" },
              { label: "Garantía Tech", href: "#" },
              { label: "Devoluciones", href: "#" },
              { label: "FAQ", href: "#" },
            ]}
          />

          {/* Contact */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-white font-black uppercase italic tracking-widest text-xs">
              Contacto
            </h4>
            <div className="space-y-4">
              <ContactItem
                icon={<MapPin size={16} />}
                text="Distrito Tech, Santiago, CL"
              />
              <ContactItem icon={<Phone size={16} />} text="+56 9 9876 5432" />
              <ContactItem
                icon={<Mail size={16} />}
                text="ops@indigoshop.tech"
              />
            </div>
          </div>
        </div>

        {/* 3. BARRA INFERIOR */}
        <div className="py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
              © {currentYear} Indigo Corporation. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
              >
                Privacidad
              </Link>
              <Link
                href="#"
                className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
              >
                Terminos
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
            <PaymentBadge label="Visa" />
            <PaymentBadge label="Mastercard" />
            <PaymentBadge label="Crypto" />
          </div>
        </div>
      </div>

      <ScrollToTop />
    </footer>
  );
};

// Sub-componentes
const FooterSection = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) => (
  <div className="lg:col-span-2 space-y-6">
    <h4 className="text-white font-black uppercase italic tracking-widest text-xs">
      {title}
    </h4>
    <ul className="space-y-4">
      {links.map((link, i) => (
        <li key={i}>
          <Link
            href={link.href}
            className="group flex items-center gap-2 text-sm font-bold hover:text-white transition-all"
          >
            <ArrowUpRight className="w-3 h-3 text-indigo-500 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all" />
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const ContactItem = ({ icon, text }: { icon: any; text: string }) => (
  <div className="flex items-center gap-3 text-sm font-bold">
    <div className="text-indigo-500">{icon}</div>
    <span>{text}</span>
  </div>
);

const PaymentBadge = ({ label }: { label: string }) => (
  <span className="px-3 py-1 border border-white/20 rounded-md text-[9px] font-black uppercase tracking-tighter">
    {label}
  </span>
);

export default Footer;
