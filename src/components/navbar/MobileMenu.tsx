// src/components/navbar/MobileMenu.tsx
"use client";

import { ArrowLeft, ChevronRight, LayoutGrid, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { Category, NavLink } from "@/types/types";
import { Logo } from "./Logo";
import { MobileNavLink } from "./MobileNavLink";
import { mobileViewTransition } from "@/lib/animations";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  menuView: "main" | "categories";
  setMenuView: (view: "main" | "categories") => void;
  categories: Category[];
  loading: boolean;
  navLinks: NavLink[];
}

export const MobileMenu = (props: MobileMenuProps) => {
  const { menuView, categories, navLinks, setMenuView } = props;

  const views = {
    main: (
      <motion.div
        key="main"
        {...mobileViewTransition}
        className="flex flex-col h-full"
      >
        <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
        <div className="p-6 bg-slate-950 text-white flex justify-between items-center">
          <Logo inverse />
          <SheetClose className="rounded-full p-2 hover:bg-white/10 transition-colors">
            <X className="w-6 h-6" />
          </SheetClose>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <MobileNavLink key={link.href} {...link} />
            ))}

            <Separator className="my-6" />

            <Button
              variant="secondary"
              className="w-full h-20 rounded-[2rem] justify-between px-6 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border-none transition-all group"
              onClick={() => setMenuView("categories")}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:text-indigo-600">
                  <LayoutGrid className="w-6 h-6" />
                </div>
                <span className="text-lg font-black uppercase tracking-tight">
                  Categorías
                </span>
              </div>
              <ChevronRight className="w-6 h-6 opacity-40" />
            </Button>
          </div>
        </ScrollArea>
      </motion.div>
    ),
    categories: (
      <motion.div
        key="categories"
        {...mobileViewTransition}
        className="flex flex-col h-full"
      >
        <div className="px-4 py-6 border-b flex items-center gap-4 bg-slate-950 text-white">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 rounded-full"
            onClick={() => setMenuView("main")}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <SheetTitle className="text-xl font-black italic tracking-tighter text-white uppercase">
            Categorías
          </SheetTitle>
        </div>

        <ScrollArea className="flex-1 p-4 pb-12">
          <div className="grid grid-cols-1 gap-2">
            {categories.map((cat: Category) => (
              <SheetClose asChild key={cat.slug}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="flex items-center justify-between px-6 py-5 capitalize font-bold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                >
                  {cat.name}
                  <ChevronRight className="w-4 h-4 opacity-20" />
                </Link>
              </SheetClose>
            ))}
          </div>
        </ScrollArea>
      </motion.div>
    ),
  };

  return (
    <Sheet open={props.isOpen} onOpenChange={props.setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-xl bg-muted/40 h-10 w-10 border border-border/50"
        >
          <Menu className="h-6 w-6 text-foreground" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="p-0 w-[90vw] max-w-100 overflow-hidden border-none shadow-2xl"
      >
        <AnimatePresence mode="wait">{views[menuView]}</AnimatePresence>
      </SheetContent>
    </Sheet>
  );
};
