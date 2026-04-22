import api from "../api";
import { LoginCredentials, AuthResponse } from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/login", credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post("/logout");
    localStorage.removeItem("croplens_token");
    localStorage.removeItem("croplens_user");
  },
};
