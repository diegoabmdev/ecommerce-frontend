import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CheckoutPage from "@/app/checkout/page";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";

vi.mock("@/context/CartContext", () => ({
  useCart: vi.fn(),
}));

vi.mock("@/context/UserContext", () => ({
  useUser: vi.fn(),
}));

vi.mock("@/hooks/useCheckoutForm", () => ({
  useCheckoutForm: vi.fn(),
}));

global.fetch = vi.fn();

describe("CheckoutPage", () => {
  const mockCart = [
    { product: { id: 1, title: "Producto Test", price: 10000 }, quantity: 2 },
  ];

  const mockAddresses = [
    { id: "1", address: "Calle Falsa 123", city: "Springfield" },
  ];

  const mockForm = {
    shippingData: { fullName: "", address: "", city: "", phone: "" },
    validation: {
      fullName: "Requerido",
      address: "Requerido",
      city: "Requerido",
      phone: "Requerido",
    },
    touched: { fullName: false, address: false, city: false, phone: false },
    isFormValid: false,
    handleInputChange: vi.fn(),
    handlePhoneChange: vi.fn(),
    setTouched: vi.fn(),
    markAllAsTouched: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useCart as any).mockReturnValue({ cart: mockCart, totalPrice: 20000 });
    (useUser as any).mockReturnValue({ addresses: mockAddresses });
    (useCheckoutForm as any).mockReturnValue(mockForm);

    delete (window as any).location;
    window.location = { href: "" } as any;
  });

  it("debería renderizar los campos principales del formulario", () => {
    render(<CheckoutPage />);

    expect(screen.getByText(/Nombre de quien recibe/i)).toBeInTheDocument();
    expect(screen.getByText(/Dirección de Entrega/i)).toBeInTheDocument();
    expect(screen.getByText(/Ciudad/i)).toBeInTheDocument();
    expect(screen.getByText(/Teléfono/i)).toBeInTheDocument();
  });

  it("debería llamar a markAllAsTouched si el formulario es inválido al intentar pagar", async () => {
    render(<CheckoutPage />);
    const payButton = screen.getByRole("button", { name: /Pagar|Finalizar/i });
    fireEvent.click(payButton);

    expect(mockForm.markAllAsTouched).toHaveBeenCalled();
  });

  it("debería autocompletar campos al seleccionar una dirección guardada", () => {
    render(<CheckoutPage />);

    const addressBtn = screen.getByText("Calle Falsa 123");
    fireEvent.click(addressBtn);

    expect(mockForm.handleInputChange).toHaveBeenCalledWith(
      "address",
      "Calle Falsa 123",
    );
    expect(mockForm.handleInputChange).toHaveBeenCalledWith(
      "city",
      "Springfield",
    );
  });

  it("debería procesar el pago y redireccionar si el formulario es válido", async () => {
    (useCheckoutForm as any).mockReturnValue({
      ...mockForm,
      isFormValid: true,
      shippingData: {
        fullName: "Diego",
        address: "Calle 1",
        city: "Stgo",
        phone: "912345678",
      },
    });

    (global.fetch as any).mockResolvedValue({
      json: async () => ({
        init_point: "https://mercadopago.com/checkout/123",
      }),
    });

    render(<CheckoutPage />);

    const payButton = screen.getByText(/Pagar/i);
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/checkout",
        expect.any(Object),
      );
      expect(window.location.href).toBe("https://mercadopago.com/checkout/123");
    });
  });

  it("debería mostrar errores de validación cuando los campos han sido tocados", () => {
    (useCheckoutForm as any).mockReturnValue({
      ...mockForm,
      touched: { fullName: true },
      validation: { fullName: "EL NOMBRE ES OBLIGATORIO" },
    });

    render(<CheckoutPage />);

    expect(screen.getByText(/EL NOMBRE ES OBLIGATORIO/i)).toBeInTheDocument();
  });
});
