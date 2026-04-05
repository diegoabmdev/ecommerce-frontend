"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { authService } from "@/services/authService";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  User,
  Address,
  LoginCredentials,
  Order,
  CartItem,
} from "@/types/types";
import { toast } from "sonner";

const AUTH_TOKEN_KEY = "novacart_token";
const ADDRESSES_KEY = "novacart_addresses";
const ORDERS_KEY = "novacart_orders";

interface UserContextType {
  user: User | null;
  addresses: Address[];
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  addAddress: (data: Omit<Address, "id" | "isDefault">) => void;
  deleteAddress: (id: string) => void;
  updateAddress: (id: string, data: Partial<Address>) => void;
  setDefaultAddress: (id: string) => void;
  orders: Order[];
  createOrder: (cart: CartItem[], total: number, paymentId: string) => Order;
  processPurchase: (
    cart: CartItem[],
    total: number,
    paymentId: string,
  ) => Order;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useLocalStorage<Order[]>(ORDERS_KEY, []);
  const [addresses, setAddresses] = useLocalStorage<Address[]>(
    ADDRESSES_KEY,
    [],
  );

  const hasFetched = useRef(false);

  // --- Helpers ---
  const createDefaultAddress = (userData: User): Address => ({
    id: "default-api",
    name: "Casa (DummyJSON)",
    address: userData.address?.address || "Calle Principal 123",
    city: userData.address?.city || "Santiago",
    state: userData.address?.state || "Metropolitana",
    postalCode: userData.address?.postalCode || "123456",
    country: userData.address?.country || "Chile",
    isDefault: true,
  });

  // --- Lógica de Órdenes (SOLID) ---
  const createOrder = useCallback(
    (cart: CartItem[], total: number, paymentId: string): Order => ({
      id: paymentId,
      date: new Date().toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Pagado",
      total: total,
      itemsCount: cart.reduce((acc, item) => acc + item.quantity, 0),
      items: [...cart],
    }),
    [],
  );

  const processPurchase = useCallback(
    (cart: CartItem[], total: number, paymentId: string) => {
      const newOrder = createOrder(cart, total, paymentId);
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    },
    [createOrder, setOrders],
  );

  // --- Autenticación e Inicialización ---
  useEffect(() => {
    if (hasFetched.current) return;

    const initAuth = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        setIsLoading(false);
        hasFetched.current = true;
        return;
      }

      try {
        const userData = await authService.getCurrentUser(token);
        setUser(userData);

        const stored = localStorage.getItem(ADDRESSES_KEY);
        if (!stored || JSON.parse(stored).length === 0) {
          const defaultAddr = createDefaultAddress(userData);
          setAddresses([defaultAddr]);
        }
      } catch (error) {
        console.error("Auth init error:", error);
        localStorage.removeItem(AUTH_TOKEN_KEY);
      } finally {
        setIsLoading(false);
        hasFetched.current = true;
      }
    };

    initAuth();
  }, [setAddresses]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const response = await authService.login(credentials);
        localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);

        const userData = response as unknown as User;

        const storedAddresses = localStorage.getItem(ADDRESSES_KEY);
        const parsedAddresses = storedAddresses
          ? JSON.parse(storedAddresses)
          : [];

        if (parsedAddresses.length === 0) {
          const defaultAddr = createDefaultAddress(userData);
          setAddresses([defaultAddr]);
        }

        setUser(userData);
        toast.success(`Bienvenido, ${userData.firstName}`);
      } catch (error: any) {
        toast.error(error.message || "Error al iniciar sesión");
        throw error;
      }
    },
    [setAddresses],
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setAddresses([]);
    localStorage.removeItem(ADDRESSES_KEY);
    toast.info("Sesión cerrada");
  }, [setAddresses]);

  // --- Gestión de Direcciones ---
  const addAddress = useCallback(
    (data: Omit<Address, "id" | "isDefault">) => {
      setAddresses((prev) => [
        ...prev,
        { ...data, id: crypto.randomUUID(), isDefault: prev.length === 0 },
      ]);
      toast.success("Dirección añadida");
    },
    [setAddresses],
  );

  const deleteAddress = useCallback(
    (id: string) => {
      setAddresses((prev) => {
        if (prev.length <= 1) {
          toast.error("Debes mantener al menos una dirección");
          return prev;
        }

        const addressToDelete = prev.find((a) => a.id === id);
        
        if (addressToDelete?.isDefault) {
          toast.error("No puedes eliminar la dirección predeterminada");
          return prev;
        }

        toast.success("Dirección eliminada");
        return prev.filter((a) => a.id !== id);
      });
    },
    [setAddresses],
  );

  const updateAddress = useCallback(
    (id: string, data: Partial<Address>) => {
      setAddresses((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...data } : a)),
      );
    },
    [setAddresses],
  );

  const setDefaultAddress = useCallback(
    (id: string) => {
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id })),
      );
    },
    [setAddresses],
  );

  // --- Context Value ---
  const value = useMemo(
    () => ({
      user,
      addresses,
      isLoading,
      login,
      logout,
      addAddress,
      deleteAddress,
      updateAddress,
      setDefaultAddress,
      orders,
      createOrder,
      processPurchase,
    }),
    [
      user,
      addresses,
      isLoading,
      login,
      logout,
      addAddress,
      deleteAddress,
      updateAddress,
      setDefaultAddress,
      orders,
      createOrder,
      processPurchase,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  return context;
};
