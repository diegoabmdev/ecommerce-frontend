// src/components/navbar/LogoNavbar.tsx
import { Store } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  inverse?: boolean;
}

export const Logo = ({ inverse = false }: LogoProps) => (
  <Link
    href="/"
    className={`italic text-2xl lg:text-3xl font-black tracking-tighter transition-transform hover:scale-105 flex items-center ${
      inverse ? "text-white" : "text-indigo-600"
    }`}
  >
    <Store
      className={`w-8 h-8 mr-4 ${inverse ? "text-indigo-400" : "text-indigo-600"}`}
    />
    NOVA
    <span className={inverse ? "text-white/90" : "text-foreground"}>CART</span>
  </Link>
);
