import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCheckoutForm } from "./useCheckoutForm";
import { useUser } from "@/context/UserContext";

vi.mock("@/context/UserContext", () => ({
  useUser: vi.fn(),
}));

describe("useCheckoutForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería inicializar con valores por defecto y errores de validación", () => {
    (useUser as any).mockReturnValue({ user: null });
    const { result } = renderHook(() => useCheckoutForm());

    expect(result.current.shippingData.phone).toBe("+56");
    expect(result.current.isFormValid).toBe(false);
    expect(result.current.validation.fullName).toBe("Nombre muy corto");
  });

  it("debería validar correctamente un formulario completo", () => {
    (useUser as any).mockReturnValue({ user: null });
    const { result } = renderHook(() => useCheckoutForm());

    act(() => {
      result.current.handleInputChange("fullName", "Diego Perez");
      result.current.handleInputChange("address", "Avenida Siempre Viva 123");
      result.current.handleInputChange("city", "Santiago");
      result.current.handlePhoneChange("+56912345678");
    });

    expect(result.current.isFormValid).toBe(true);
    expect(result.current.validation.fullName).toBeNull();
  });

  it("debería formatear y limitar el teléfono a 9 dígitos después del +56", () => {
    (useUser as any).mockReturnValue({ user: null });
    const { result } = renderHook(() => useCheckoutForm());

    act(() => {
      // Intentamos meter letras y más números de la cuenta
      result.current.handlePhoneChange("+569-abcd-1234567890");
    });

    // Debería quedar +56 + 9 dígitos (912345678)
    expect(result.current.shippingData.phone).toBe("+56912345678");
    expect(result.current.shippingData.phone.length).toBe(12);
  });

  it("debería cargar datos del usuario automáticamente cuando el usuario hace login", () => {
    const mockUser = { firstName: "Juan", lastName: "Topo", phone: "987654321" };
    (useUser as any).mockReturnValue({ user: mockUser });

    const { result } = renderHook(() => useCheckoutForm());

    // El useEffect debería haber llenado el nombre
    expect(result.current.shippingData.fullName).toBe("Juan Topo");
    expect(result.current.shippingData.phone).toBe("+56987654321");
  });

  it("debería marcar todos los campos como tocados al llamar a markAllAsTouched", () => {
    (useUser as any).mockReturnValue({ user: null });
    const { result } = renderHook(() => useCheckoutForm());

    act(() => {
      result.current.markAllAsTouched();
    });

    expect(result.current.touched.fullName).toBe(true);
    expect(result.current.touched.phone).toBe(true);
    expect(result.current.touched.address).toBe(true);
    expect(result.current.touched.city).toBe(true);
  });
});