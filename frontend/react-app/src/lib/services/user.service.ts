import api from "../api";
import type { User } from "@/types/auth";

export const userService = {
  async getAgents() {
    const response = await api.get<User[]>("/agents");
    return response.data;
  },

  async getAdmins() {
    const response = await api.get<User[]>("/admins");
    return response.data;
  },

  async createNewUser(data: any) {
    const response = await api.post<{ message: string; user: User }>("/users", data);
    return response.data;
  },

  async deleteUser(id: number) {
    await api.delete(`/users/${id}`);
  },
};
