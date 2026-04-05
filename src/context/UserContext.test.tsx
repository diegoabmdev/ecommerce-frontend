import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { UserProvider, useUser } from "@/context/UserContext";
import { authService } from "@/services/authService";
import { User, Order, CartItem } from "@/types/types";

// 1. Mock de Servicios
vi.mock("@/services/authService", () => ({
  authService: {
    login: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

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
    length: 0,
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true
});

if (!global.crypto.randomUUID) {
  Object.defineProperty(global.crypto, "randomUUID", {
    value: vi.fn(() => `uuid-${Math.random().toString(36).substr(2, 9)}`),
  });
}

describe("UserContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <UserProvider>{children}</UserProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("debería inicializar con usuario null y cargar desde token si existe", async () => {
    const mockUser = { id: 1, firstName: "Diego", address: {} } as User;
    localStorage.setItem("novacart_token", "fake-token");
    vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUser(), { wrapper });
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toEqual(mockUser);
  });

  it("NO debería permitir eliminar la única dirección existente", async () => {
    const { result } = renderHook(() => useUser(), { wrapper });

    await act(async () => {
      result.current.addAddress({ name: "Única" } as any);
    });
    
    const idUnico = result.current.addresses[0].id;

    await act(async () => {
      result.current.deleteAddress(idUnico);
    });

    expect(result.current.addresses).toHaveLength(1);
    expect(result.current.addresses[0].name).toBe("Única");
  });

  it("NO debería permitir eliminar una dirección si es predeterminada", async () => {
    const { result } = renderHook(() => useUser(), { wrapper });

    await act(async () => {
      result.current.addAddress({ name: "Principal" } as any); // isDefault: true
    });
    await act(async () => {
      result.current.addAddress({ name: "Secundaria" } as any); // isDefault: false
    });

    const idPrincipal = result.current.addresses.find(a => a.name === "Principal")!.id;

    await act(async () => {
      result.current.deleteAddress(idPrincipal);
    });

    expect(result.current.addresses).toHaveLength(2);
  });

  it("debería crear un objeto de orden correctamente con createOrder", () => {
    const { result } = renderHook(() => useUser(), { wrapper });
    const mockCart: CartItem[] = [
      { product: { id: 1, title: "Test", price: 100 } as any, quantity: 2 }
    ];

    const order = result.current.createOrder(mockCart, 200, "PAY-123");

    expect(order.id).toBe("PAY-123");
    expect(order.total).toBe(200);
    expect(order.itemsCount).toBe(2);
    expect(order.status).toBe("Pagado");
  });

  it("debería procesar una compra y guardarla en el historial", async () => {
    const { result } = renderHook(() => useUser(), { wrapper });
    const mockCart: CartItem[] = [{ product: { id: 1 } as any, quantity: 1 }];

    let createdOrder: Order | undefined;
    await act(async () => {
      createdOrder = result.current.processPurchase(mockCart, 1000, "CONFIRM-001");
    });

    expect(result.current.orders).toHaveLength(1);
    expect(result.current.orders[0].id).toBe("CONFIRM-001");
    expect(createdOrder?.id).toBe("CONFIRM-001");
  });

  it("debería limpiar el estado al hacer logout", async () => {
    localStorage.setItem("novacart_token", "active-token");
    vi.mocked(authService.getCurrentUser).mockResolvedValue({ id: 1 } as User);

    const { result } = renderHook(() => useUser(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.addresses).toHaveLength(0);
    expect(localStorage.getItem("novacart_token")).toBeNull();
  });
});