import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

const mockCreate = vi.fn().mockResolvedValue({
  init_point: "https://mercadopago.com/checkout/test-link",
});

vi.mock("mercadopago", () => {
  return {
    MercadoPagoConfig: vi.fn().mockImplementation(function() {
      return {}; 
    }),
    Preference: vi.fn().mockImplementation(function() {
      return {
        create: mockCreate
      };
    }),
  };
});

describe("POST /api/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.MP_ACCESS_TOKEN = "test-token";
    process.env.NEXT_PUBLIC_URL = "http://test.com";
  });

  it("debería crear una preferencia de pago y devolver el init_point", async () => {
    const mockItems = [
      {
        product: { id: 1, title: "Producto Pro", price: 100 },
        quantity: 2,
      },
    ];

    const request = new Request("http://localhost:3000/api/checkout", {
      method: "POST",
      body: JSON.stringify({ items: mockItems }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.init_point).toBe("https://mercadopago.com/checkout/test-link");

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({
              unit_price: 85000,
            }),
          ]),
        }),
      })
    );
  });

  it("debería redondear el precio correctamente a entero para CLP", async () => {
    const mockItems = [
      {
        product: { id: 2, title: "Producto Barato", price: 1.99 },
        quantity: 1,
      },
    ];

    const request = new Request("http://localhost:3000/api/checkout", {
      method: "POST",
      body: JSON.stringify({ items: mockItems }),
    });

    await POST(request);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          items: [
            expect.objectContaining({
              unit_price: 1692,
            }),
          ],
        }),
      })
    );
  });
});