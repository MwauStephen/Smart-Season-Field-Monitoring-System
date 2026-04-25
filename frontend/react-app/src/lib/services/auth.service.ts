import api from "../api";
import type { AuthResponse, LoginCredentials, User } from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/login", credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post("/logout");
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>("/user");
    return response.data;
  },
};
