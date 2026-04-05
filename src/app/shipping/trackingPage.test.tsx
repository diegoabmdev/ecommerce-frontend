import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TrackingPage from "./page";
import { useUser } from "@/context/UserContext";

vi.mock("@/context/UserContext", () => ({
  useUser: vi.fn(),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe("TrackingPage", () => {
  const mockOrders = [
    {
      id: "12345",
      date: "25 feb 2026",
      status: "Pagado",
      total: 28482,
      itemsCount: 2,
      items: [
        {
          product: { id: 1, title: "Essence Mascara Lash Princess", thumbnail: "/test.jpg", price: 10000 },
          quantity: 1
        },
        {
          product: { id: 2, title: "Eyeshadow Palette with Mirror", thumbnail: "/test2.jpg", price: 18482 },
          quantity: 1
        }
      ]
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Inyectamos el mock de las órdenes
    (useUser as any).mockReturnValue({
      orders: mockOrders,
    });
  });

  it("debería renderizar el input de búsqueda y el botón", () => {
    render(<TrackingPage />);
    expect(screen.getByPlaceholderText(/Ej: 12345/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Buscar Envío/i })).toBeInTheDocument();
  });

  it("debería mostrar mensaje de error si el ID no existe en las órdenes", () => {
    render(<TrackingPage />);
    const input = screen.getByPlaceholderText(/Ej: 12345/i);
    const button = screen.getByRole("button", { name: /Buscar Envío/i });

    fireEvent.change(input, { target: { value: "99999" } });
    fireEvent.click(button);

    expect(screen.getByText(/No encontramos ningún pedido con ese ID/i)).toBeInTheDocument();
  });

  it("debería mostrar los detalles del pedido y productos cuando el ID es correcto", () => {
    render(<TrackingPage />);
    const input = screen.getByPlaceholderText(/Ej: 12345/i);
    const button = screen.getByRole("button", { name: /Buscar Envío/i });

    fireEvent.change(input, { target: { value: "12345" } });
    fireEvent.click(button);

    // Validar estado y totales con formato de miles (toLocaleString)
    expect(screen.getByText("Pagado")).toBeInTheDocument();
    expect(screen.getByText("$28.482")).toBeInTheDocument();

    // Validar nombres de productos
    expect(screen.getByText("Essence Mascara Lash Princess")).toBeInTheDocument();
    expect(screen.getByText("Eyeshadow Palette with Mirror")).toBeInTheDocument();
  });

  it("debería limpiar el error al realizar una búsqueda exitosa", () => {
    render(<TrackingPage />);
    const input = screen.getByPlaceholderText(/Ej: 12345/i);
    const button = screen.getByRole("button", { name: /Buscar Envío/i });

    // 1. Buscamos algo inexistente
    fireEvent.change(input, { target: { value: "000" } });
    fireEvent.click(button);
    expect(screen.getByText(/No encontramos/i)).toBeInTheDocument();

    // 2. Buscamos el ID real
    fireEvent.change(input, { target: { value: "12345" } });
    fireEvent.click(button);
    
    expect(screen.queryByText(/No encontramos/i)).not.toBeInTheDocument();
  });
});