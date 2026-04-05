import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";
import { Product } from "@/types/types";

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
  id: 1,
  title: "Laptop Pro",
  price: 100,
  images: ["image.png"],
  description: "Test description",
  category: "electronics",
  discountPercentage: 0,
  rating: 0,
  stock: 0,
  tags: [],
  brand: "",
  sku: "",
  weight: 0,
  dimensions: { width: 0, height: 0, depth: 0 },
  warrantyInformation: "",
  shippingInformation: "",
  availabilityStatus: "",
  reviews: [],
  returnPolicy: "",
  minimumOrderQuantity: 0,
  meta: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), barcode: "", qrCode: "" },
  thumbnail: ""
};

describe("CartContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("debería iniciar con un carrito vacío", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cart).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it("debería agregar productos y calcular totales correctamente", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(1);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(100000);
  });

  it("debería incrementar cantidad si el producto ya existe", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      result.current.addToCart(mockProduct);
      result.current.addToCart(mockProduct);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
  });

  it("debería actualizar la cantidad manualmente", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      result.current.addToCart(mockProduct);
    });

    await act(async () => {
      result.current.updateQuantity(1, 5);
    });

    expect(result.current.cart[0].quantity).toBe(5);
    expect(result.current.totalPrice).toBe(500000);
  });

  it("debería eliminar el producto si la cantidad se actualiza a 0", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      result.current.addToCart(mockProduct);
    });

    await act(async () => {
      result.current.updateQuantity(1, 0);
    });

    expect(result.current.cart).toHaveLength(0);
  });

  it("debería persistir datos en localStorage", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      result.current.addToCart(mockProduct);
    });
    const savedData = JSON.parse(localStorage.getItem("novacart_storage") || "[]");
    expect(savedData[0].product.id).toBe(1);
  });

  it("debería hidratar el estado desde localStorage al iniciar", async () => {
    const initialCart = [{ product: mockProduct, quantity: 3 }];
    localStorage.setItem("novacart_storage", JSON.stringify(initialCart));

    const { result } = renderHook(() => useCart(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(300000);
  });
});