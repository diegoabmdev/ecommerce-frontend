import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "./authService";
import { api } from "./apiClient";
import {
  User,
  LoginResponse,
  LoginCredentials,
  RegisterData,
} from "@/types/types";

vi.mock("./apiClient", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const apiMock = vi.mocked(api);

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("login debería enviar las credenciales y el campo expiresInMins", async () => {
    const credentials: LoginCredentials = {
      username: "diego",
      password: "123",
    };
    const mockResponse = {
      id: 1,
      username: "diego",
      accessToken: "token-xyz",
    } as LoginResponse;

    apiMock.post.mockResolvedValue(mockResponse);

    const result = await authService.login(credentials);

    expect(api.post).toHaveBeenCalledWith("/auth/login", {
      ...credentials,
      expiresInMins: 60,
    });
    expect(result.accessToken).toBe("token-xyz");
  });

  it("getCurrentUser debería enviar el token en el header de Authorization", async () => {
    const token = "mi-token-secreto";
    const mockUser = {
      id: 1,
      username: "diego",
      email: "diego@test.com",
    } as User;

    apiMock.get.mockResolvedValue(mockUser);

    const result = await authService.getCurrentUser(token);

    expect(api.get).toHaveBeenCalledWith("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(result.email).toBe("diego@test.com");
  });

  it("register debería enviar los datos de usuario al endpoint correcto", async () => {
    const registerData: RegisterData = {
      firstName: "Diego",
      lastName: "Pérez",
      username: "diego123",
      email: "diego@test.com",
    };
    const mockUserResponse = { ...registerData, id: 50, role: "user" } as User;

    apiMock.post.mockResolvedValue(mockUserResponse);

    const result = await authService.register(registerData);

    expect(api.post).toHaveBeenCalledWith("/users/add", registerData);
    expect(result.id).toBe(50);
  });
});
