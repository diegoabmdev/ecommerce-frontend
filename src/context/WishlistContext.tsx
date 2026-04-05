"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { Product } from "@/types/types";
import { useCart } from "./CartContext";
import { toast } from "sonner";

const WISHLIST_STORAGE_KEY = "novacart_wishlist";

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: number) => boolean;
  clearWishlist: () => void;
  totalFavorites: number;
  isInitialized: boolean;
  moveAllToCart: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { addToCart } = useCart();

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error al analizar el localstorage de wishlist", e);
          return [];
        }
      }
    }
    return [];
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => setIsInitialized(true));
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, isInitialized]);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const isInWishlist = useCallback(
    (id: number) => wishlist.some((item) => item.id === id),
    [wishlist],
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  const moveAllToCart = useCallback(() => {
    if (wishlist.length === 0) return;

    wishlist.forEach((product) => {
      addToCart(product);
    });

    setWishlist([]);
    toast.success("Todos los productos movidos al carrito");
  }, [wishlist, addToCart]);

  const totalFavorites = wishlist.length;

  const value = useMemo(
    () => ({
      wishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
      totalFavorites,
      isInitialized,
      moveAllToCart,
    }),
    [
      wishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
      totalFavorites,
      isInitialized,
      moveAllToCart,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context)
    throw new Error("useWishlist debe usarse dentro de WishlistProvider");
  return context;
};
