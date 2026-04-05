import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { WishlistProvider, useWishlist } from "./WishlistContext";
import { CartProvider, useCart } from "./CartContext";
import { Product } from "@/types/types";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/lib/utils", () => ({
  convertUSDtoCLP: vi.fn((usd: number) => usd * 1000),
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

const mockProduct: Product = {
  id: 99,
  title: "Producto Favorito",
  price: 50,
  images: ["fav.png"],
  description: "Desc",
  category: "test",
} as any;

describe("WishlistContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </CartProvider>
  );

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("debería iniciar con una lista vacía", async () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });
    // Esperamos a que se inicialice para evitar el warning de 'act'
    await waitFor(() => expect(result.current.isInitialized).toBe(true));
    expect(result.current.wishlist).toEqual([]);
  });

  it("debería mover todos los productos al carrito y limpiar la lista", async () => {
    // IMPORTANTE: Usamos un solo renderHook para ambos contextos
    const { result } = renderHook(() => ({
      wishlist: useWishlist(),
      cart: useCart()
    }), { wrapper });

    // Esperamos hidratación inicial
    await waitFor(() => expect(result.current.wishlist.isInitialized).toBe(true));

    // 1. Agregar a favoritos
    await act(async () => {
      result.current.wishlist.toggleWishlist(mockProduct);
    });

    // 2. Mover al carrito
    await act(async () => {
      result.current.wishlist.moveAllToCart();
    });

    // 3. Verificaciones
    expect(result.current.wishlist.wishlist).toHaveLength(0);
    expect(result.current.cart.cart).toHaveLength(1);
    expect(result.current.cart.cart[0].product.id).toBe(99);
  });

  it("debería agregar un producto a favoritos (toggle)", async () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });
    await waitFor(() => expect(result.current.isInitialized).toBe(true));

    await act(async () => {
      result.current.toggleWishlist(mockProduct);
    });

    expect(result.current.wishlist).toHaveLength(1);
    expect(result.current.isInWishlist(99)).toBe(true);
  });

  it("debería quitar un producto de favoritos si ya existe (toggle)", async () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });
    await waitFor(() => expect(result.current.isInitialized).toBe(true));

    await act(async () => {
      result.current.toggleWishlist(mockProduct);
    });
    await act(async () => {
      result.current.toggleWishlist(mockProduct);
    });

    expect(result.current.wishlist).toHaveLength(0);
  });

  it("debería persistir en localStorage cuando cambia la lista", async () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });
    await waitFor(() => expect(result.current.isInitialized).toBe(true));

    await act(async () => {
      result.current.toggleWishlist(mockProduct);
    });

    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem("novacart_wishlist") || "[]");
      expect(saved).toHaveLength(1);
    });
  });

  it("debería hidratar el estado inicial desde localStorage", async () => {
    const savedItems = [mockProduct];
    localStorage.setItem("novacart_wishlist", JSON.stringify(savedItems));

    const { result } = renderHook(() => useWishlist(), { wrapper });

    await waitFor(() => expect(result.current.isInitialized).toBe(true));
    expect(result.current.wishlist).toHaveLength(1);
    expect(result.current.wishlist[0].id).toBe(99);
  });

  it("debería limpiar toda la wishlist", async () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });
    await waitFor(() => expect(result.current.isInitialized).toBe(true));

    await act(async () => {
      result.current.toggleWishlist(mockProduct);
    });
    await act(async () => {
      result.current.clearWishlist();
    });

    expect(result.current.wishlist).toHaveLength(0);
  });
});