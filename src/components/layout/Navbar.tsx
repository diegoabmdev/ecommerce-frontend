"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Heart, ShoppingCart, Zap, Package, Tag, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Hooks y Contextos
import { useCategory } from "@/hooks/useCategory";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useUser } from "@/context/UserContext";

// Componentes Refactorizados
import { AnnouncementBar } from "@/components/navbar/AnnouncementBar";
import { MobileMenu } from "@/components/navbar/MobileMenu";
import { MegaMenu } from "@/components/navbar/MegaMenu";
import { SearchInput } from "@/components/navbar/SearchInput";
import { NavBadgeIcon } from "@/components/navbar/NavBadgeIcon";
import { DesktopLinks } from "@/components/navbar/DesktopLinks";
import { Logo } from "@/components/navbar/Logo";
import { SupportLinks } from "@/components/navbar/SupportLinks";

// Tipos
import { NavLink } from "@/types/types";

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { totalFavorites } = useWishlist();
  const { categories, loading } = useCategory();
  const { user } = useUser();

  // Estados de Interfaz
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuHovered, setIsMegaMenuHovered] = useState(false);
  const [mobileMenuView, setMobileMenuView] = useState<"main" | "categories">("main");

  const navLinks: NavLink[] = [
    { name: "Inicio", href: "/", icon: <Zap className="w-4 h-4" /> },
    { name: "Productos", href: "/products", icon: <Package className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      <AnnouncementBar />

      <div className="bg-background/95 backdrop-blur-md border-b">
        {/* --- BLOQUE 1: CABECERA PRINCIPAL (Logo, Search, Actions) --- */}
        <div className="mx-auto max-w-360 flex h-16 lg:h-20 items-center justify-between gap-4 px-4 lg:px-10">
          
          {/* Lado Izquierdo: Menú Móvil y Logo */}
          <div className="flex items-center gap-4">
            <MobileMenu
              isOpen={isMobileMenuOpen}
              setIsOpen={setIsMobileMenuOpen}
              menuView={mobileMenuView}
              setMenuView={setMobileMenuView}
              categories={categories}
              loading={loading}
              navLinks={navLinks}
            />
            <Logo />
          </div>

          {/* Centro: Buscador (Solo Desktop) */}
          <SearchInput className="hidden lg:flex flex-1 max-w-2xl mx-12" />

          {/* Lado Derecho: Acciones de Usuario */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Perfil de Usuario con Avatar Dinámico */}
            <Link href={user ? "/profile" : "/login"}>
              <div className="relative h-11 w-11 flex items-center justify-center rounded-xl transition-all hover:bg-slate-100 border border-transparent hover:border-slate-200 group">
                {user?.image ? (
                  <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-indigo-500 shadow-sm transition-transform group-hover:scale-110">
                    <Image
                      src={user.image}
                      alt={user.username || "Avatar"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <UserIcon className="h-6 w-6 text-slate-600 group-hover:text-indigo-600" />
                )}
              </div>
            </Link>

            <NavBadgeIcon
              href="/wishlist"
              count={totalFavorites}
              icon={<Heart className="h-6 w-6" />}
              hoverClass="hover:text-pink-500 hover:bg-pink-50"
            />

            <NavBadgeIcon
              href="/cart"
              count={totalItems}
              icon={<ShoppingCart className="h-6 w-6" />}
              isCart
            />
          </div>
        </div>

        {/* --- BLOQUE 2: NAVEGACIÓN SECUNDARIA (Desktop Only) --- */}
        <nav className="hidden lg:block border-t border-border/40 bg-muted/5">
          <div className="mx-auto max-w-360 px-10 flex items-center justify-between h-12">
            <div className="flex items-center gap-2 h-full">
              <MegaMenu
                categories={categories}
                loading={loading}
                isHovered={isMegaMenuHovered}
                setIsHovered={setIsMegaMenuHovered}
              />
              <DesktopLinks navLinks={navLinks} pathname={pathname} />
            </div>
            
            <SupportLinks />
          </div>
        </nav>

        {/* --- BLOQUE 3: BUSCADOR MÓVIL (Solo visible en Mobile) --- */}
        <div className="lg:hidden px-4 pb-4">
          <SearchInput />
        </div>
      </div>
    </header>
  );
}