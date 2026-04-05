import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import ProfilePage from "./page";
import { useUser } from "@/context/UserContext";
import userEvent from "@testing-library/user-event";

// Mock del contexto
vi.mock("@/context/UserContext", () => ({
  useUser: vi.fn(),
}));

describe("ProfilePage Integration", () => {
  const mockAddAddress = vi.fn();
  const mockDeleteAddress = vi.fn();
  const mockSetDefaultAddress = vi.fn();

  const mockUser = {
    username: "jdoe",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    role: "user",
    image: "/avatar.jpg",
  };

  const mockAddresses = [
    {
      id: "addr-1",
      name: "Casa",
      address: "Av. Siempre Viva 742",
      city: "Santiago",
      state: "RM",
      postalCode: "123",
      country: "Chile",
      isDefault: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useUser as any).mockReturnValue({
      user: mockUser,
      addresses: mockAddresses,
      orders: [],
      isLoading: false,
      logout: vi.fn(),
      addAddress: mockAddAddress,
      deleteAddress: mockDeleteAddress,
      setDefaultAddress: mockSetDefaultAddress,
      updateAddress: vi.fn(),
    });
  });

  it("debería mostrar la información del perfil correctamente", () => {
    render(<ProfilePage />);
    const mainTitle = screen.getByRole("heading", { level: 1 });
    expect(mainTitle).toHaveTextContent(/John/i);
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
  });

  it("debería abrir el modal de 'Nueva Dirección' al hacer clic en el botón", async () => {
    render(<ProfilePage />);
    const btnNueva = screen.getByRole("button", { name: /Nueva Dirección/i });
    fireEvent.click(btnNueva);

    // Esperamos a que el modal sea visible (Radix usa portales)
    await waitFor(() => {
      expect(
        screen.getByText("Nueva Dirección", { selector: "h2" }),
      ).toBeInTheDocument();
    });
  });

it("debería llamar a addAddress cuando se completa el formulario del modal", async () => {
  const user = userEvent.setup();
  render(<ProfilePage />);

  // 1. Abrir modal
  const btnNueva = screen.getByRole("button", { name: /Nueva Dirección/i });
  await user.click(btnNueva);

  // 2. Llenar los campos usando los labels (Nombre, Dirección, Ciudad, C. Postal)
  // Nota: En tu componente los labels están presentes como texto plano encima de los inputs
  const inputNombre = await screen.findByPlaceholderText(/Ej: Mi Casa/i);
  const inputDireccion = screen.getByPlaceholderText(/Calle, número, piso/i);
  
  // Como no tienen placeholder ni id/label asociado por "htmlFor", 
  // los buscamos por su posición o valor inicial si es posible, 
  // pero lo más seguro es buscarlos por su rol y el orden o proximidad:
  const inputs = screen.getAllByRole("textbox");
  // inputs[0] -> Nombre, inputs[1] -> Dirección, inputs[2] -> Ciudad, inputs[3] -> C. Postal

  await user.type(inputs[0], "Oficina");
  await user.type(inputs[1], "Calle 123");
  await user.type(inputs[2], "Santiago");
  // El código postal ya tiene un default "020020" en tu estado inicial, 
  // pero vamos a asegurarnos de que esté lleno.
  await user.clear(inputs[3]);
  await user.type(inputs[3], "123456");

  // 3. Enviar el formulario
  const submitBtn = screen.getByRole("button", { name: /Crear Dirección/i });
  await user.click(submitBtn);

  // 4. Verificación
  await waitFor(() => {
    expect(mockAddAddress).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Oficina",
        address: "Calle 123",
        city: "Santiago",
        postalCode: "123456"
      })
    );
  });
});

  it("debería llamar a deleteAddress al hacer clic en el botón de basura", async () => {
    // IMPORTANTE: Creamos una dirección NO principal para que el botón de borrar exista
    const nonDefaultAddress = [
      { ...mockAddresses[0], id: "addr-delete", isDefault: false },
    ];

    (useUser as any).mockReturnValue({
      user: mockUser,
      addresses: nonDefaultAddress,
      orders: [],
      isLoading: false,
      deleteAddress: mockDeleteAddress,
    });

    render(<ProfilePage />);

    // Buscamos la card que contiene la dirección de prueba
    const addressText = screen.getByText(nonDefaultAddress[0].address);
    const card = addressText.closest("div");

    // En lugar de buscar por rol "button" que está fallando por opacidad,
    // buscamos el botón que contiene el icono o usamos querySelector si es necesario
    // Pero lo más limpio es buscar por un texto que sepamos que NO es el principal
    const buttons = within(card!.parentElement!).getAllByRole("button", {
      hidden: true,
    });

    // El botón de borrar es el que no tiene el texto de "Marcar como principal"
    const deleteBtn = buttons.find(
      (btn) => !btn.textContent?.includes("principal"),
    );

    if (deleteBtn) {
      fireEvent.click(deleteBtn);
    }

    expect(mockDeleteAddress).toHaveBeenCalledWith("addr-delete");
  });
});
