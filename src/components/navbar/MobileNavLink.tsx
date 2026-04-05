// src/components/navbar/MobileNavLink.tsx
import Link from "next/link";
import { SheetClose } from "../ui/sheet";
import { NavLink } from "@/types/types";

export const MobileNavLink = ({ href, name, icon }: NavLink) => {
  return (
    <SheetClose asChild>
      <Link
        href={href}
        className="flex items-center gap-4 px-4 py-4 rounded-2xl text-lg font-bold transition-all active:scale-95 hover:bg-indigo-50 hover:text-indigo-600 group"
      >
        <span className="p-3 bg-slate-100 rounded-xl group-hover:bg-indigo-100 transition-colors">
          {icon}
        </span>
        {name}
      </Link>
    </SheetClose>
  );
};
