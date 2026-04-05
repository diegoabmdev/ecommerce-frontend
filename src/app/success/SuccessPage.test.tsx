import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import SuccessPage from "./page";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useSearchParams } from "next/navigation";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

vi.mock("@/context/CartContext", () => ({
  useCart: vi.fn(),
}));

vi.mock("@/context/UserContext", () => ({
  useUser: vi.fn(),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe("SuccessPage", () => {
  const mockCart = [
    {
      product: {
        id: "123",
        title: "Teclado Gamer",
        price: 100,
        thumbnail: "/test.jpg",
      },
      quantity: 1,
    },
  ];

  const mockClearCart = vi.fn();
  const mockProcessPurchase = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useSearchParams as any).mockReturnValue({
      get: (key: string) => (key === "payment_id" ? "MP-12345" : null),
    });

    (useCart as any).mockReturnValue({
      cart: mockCart,
      totalPrice: 100,
      clearCart: mockClearCart,
    });

    (useUser as any).mockReturnValue({
      processPurchase: mockProcessPurchase.mockReturnValue({
        id: "MP-12345",
        items: mockCart,
        total: 85000,
        date: new Date().toISOString(),
      }),
    });

    window.history.replaceState = vi.fn();
  });

  it("debería mostrar el skeleton mientras no hay orden confirmada", () => {
    (useUser as any).mockReturnValue({
      processPurchase: () => null,
    });

    render(<SuccessPage />);
    expect(screen.getByText(/Validando pago.../i)).toBeInTheDocument();
  });

  it("debería procesar la compra, limpiar el carrito y mostrar el éxito", async () => {
    render(<SuccessPage />);

    await waitFor(() => {
      expect(mockProcessPurchase).toHaveBeenCalledWith(
        mockCart,
        100,
        "MP-12345",
      );

      expect(mockClearCart).toHaveBeenCalled();
      expect(window.history.replaceState).toHaveBeenCalledWith(
        {},
        "",
        "/success",
      );
    });

    expect(screen.getByText(/Confirmado/i)).toBeInTheDocument();
    expect(screen.getByText(/Gracias por tu compra/i)).toBeInTheDocument();
  });

  it("no debería procesar la compra si el carrito está vacío (evitar duplicados)", () => {
    (useCart as any).mockReturnValue({
      cart: [],
      totalPrice: 0,
      clearCart: mockClearCart,
    });

    render(<SuccessPage />);

    expect(mockProcessPurchase).not.toHaveBeenCalled();
  });
});
