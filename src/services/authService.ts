import { api } from "./apiClient";
import {
  User,
  LoginCredentials,
  RegisterData,
  LoginResponse,
} from "@/types/types";

export const authService = {
  login: (credentials: LoginCredentials): Promise<LoginResponse> =>
    api.post<LoginResponse>("/auth/login", {
      ...credentials,
      expiresInMins: 60,
    }),

  getCurrentUser: (token: string): Promise<User> =>
    api.get<User>("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  register: (data: RegisterData): Promise<User> =>
    api.post<User>("/users/add", data),
};
