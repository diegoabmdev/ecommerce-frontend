import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CartPage from "@/app/cart/page";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/useProducts";
import { useRouter } from "next/navigation";
import { WishlistProvider } from "@/context/WishlistContext";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/context/CartContext", () => ({
  useCart: vi.fn(),
}));

vi.mock("@/hooks/useProducts", () => ({
  useProducts: vi.fn(),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe("CartPage", () => {
  const mockPush = vi.fn();
  const mockUpdateQuantity = vi.fn();
  const mockClearCart = vi.fn();

  const mockProduct = {
    id: 1,
    title: "Smartphone Pro",
    price: 100,
    thumbnail: "/test.jpg",
    stock: 10,
    discountPercentage: 15,
    images: ["/test.jpg"],
  };

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(<WishlistProvider>{ui}</WishlistProvider>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear(); // Limpia el mock antes de cada test
    (useRouter as any).mockReturnValue({ push: mockPush });
    (useProducts as any).mockReturnValue({ products: [mockProduct] });
  });

  it("debería mostrar el spinner de carga si isLoaded es false", () => {
    (useCart as any).mockReturnValue({ isLoaded: false });
    const { container } = renderWithProviders(<CartPage />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("debería mostrar mensaje de carrito vacío si no hay items", () => {
    (useCart as any).mockReturnValue({
      isLoaded: true,
      totalItems: 0,
      cart: [],
    });
    renderWithProviders(<CartPage />);
    expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
  });

  it("debería calcular correctamente el subtotal y el envío (con costo)", () => {
    (useCart as any).mockReturnValue({
      isLoaded: true,
      totalItems: 1,
      totalPrice: 30000,
      cart: [{ product: mockProduct, quantity: 1 }],
    });
    renderWithProviders(<CartPage />);
    expect(screen.getByText("$5.000")).toBeInTheDocument();
  });

  it("debería mostrar ENVÍO GRATIS si el total es superior a 50.000", () => {
    (useCart as any).mockReturnValue({
      isLoaded: true,
      totalItems: 1,
      totalPrice: 60000,
      cart: [{ product: mockProduct, quantity: 1 }],
    });

    renderWithProviders(<CartPage />);

    const freeElements = screen.getAllByText(/GRATIS/i);
    expect(freeElements.length).toBeGreaterThan(0);

    expect(screen.getByText(/¡Tienes envío gratis!/i)).toBeInTheDocument();
  });

  it("debería llamar a updateQuantity al incrementar o decrementar", () => {
    (useCart as any).mockReturnValue({
      isLoaded: true,
      totalItems: 1,
      totalPrice: 10000,
      cart: [{ product: mockProduct, quantity: 2 }],
      updateQuantity: mockUpdateQuantity,
    });

    renderWithProviders(<CartPage />);

    const buttons = screen.getAllByRole("button");
    const plusBtn = buttons.find((btn) => btn.querySelector(".lucide-plus"));
    const minusBtn = buttons.find((btn) => btn.querySelector(".lucide-minus"));

    if (plusBtn) fireEvent.click(plusBtn);
    expect(mockUpdateQuantity).toHaveBeenCalledWith(mockProduct.id, 3);

    if (minusBtn) fireEvent.click(minusBtn);
    expect(mockUpdateQuantity).toHaveBeenCalledWith(mockProduct.id, 1);
  });

  it("debería navegar a checkout al hacer clic en 'Finalizar Compra'", () => {
    (useCart as any).mockReturnValue({
      isLoaded: true,
      totalItems: 1,
      totalPrice: 10000,
      cart: [{ product: mockProduct, quantity: 1 }],
    });
    renderWithProviders(<CartPage />);
    const checkoutBtn = screen.getByText(/Finalizar Compra/i);
    fireEvent.click(checkoutBtn);
    expect(mockPush).toHaveBeenCalledWith("/checkout");
  });

  it("debería llamar a clearCart al presionar 'Vaciar Carrito'", () => {
    (useCart as any).mockReturnValue({
      isLoaded: true,
      totalItems: 1,
      totalPrice: 10000,
      cart: [{ product: mockProduct, quantity: 1 }],
      clearCart: mockClearCart,
    });
    renderWithProviders(<CartPage />);
    const clearBtn = screen.getByText(/Vaciar Carrito/i);
    fireEvent.click(clearBtn);
    expect(mockClearCart).toHaveBeenCalled();
  });
});
