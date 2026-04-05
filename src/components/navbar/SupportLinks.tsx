import { Headset, Truck } from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";

export const SupportLinks = () => (
  <div className="flex items-center gap-6 text-[11px] font-black text-muted-foreground/90 uppercase tracking-widest">
    <span className="flex items-center gap-2">
      <Headset className="w-4 h-4 text-indigo-500" /> Soporte 24/7
    </span>
    <Separator orientation="vertical" className="h-4" />
    <Link
      href="/shipping"
      className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
    >
      <Truck className="w-4 h-4 text-indigo-500" /> Rastrear Envío
    </Link>
  </div>
);
