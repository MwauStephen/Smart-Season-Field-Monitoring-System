import api from "../api";
import { LoginCredentials, AuthResponse } from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/login", credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/logout");
    } catch (error) {
      console.warn("Logout API request failed, but clearing local session anyway.", error);
    } finally {
      localStorage.removeItem("croplens_token");
      localStorage.removeItem("croplens_user");
    }
  },
};
