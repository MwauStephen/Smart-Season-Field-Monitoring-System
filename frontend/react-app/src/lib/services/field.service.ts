import api from "../api";
import type { Field, FieldUpdate } from "@/types/field";

export const fieldService = {
  async getAllFields() {
    const response = await api.get<Field[]>("/fields");
    return response.data;
  },

  async getFieldDetails(id: number) {
    const response = await api.get<Field>(`/fields/${id}`);
    return response.data;
  },

  async createField(data: any) {
    const response = await api.post<Field>("/fields", data);
    return response.data;
  },

  async updateField(id: number, data: any) {
    const response = await api.put<Field>(`/fields/${id}`, data);
    return response.data;
  },

  async deleteField(id: number) {
    await api.delete(`/fields/${id}`);
  },

  async getFieldHistory(id: number) {
    const response = await api.get<FieldUpdate[]>(`/fields/${id}/updates`);
    return response.data;
  },

  async logFieldUpdate(id: number, data: { stage: string; notes?: string }) {
    const response = await api.post<FieldUpdate>(`/fields/${id}/updates`, data);
    return response.data;
  },
};
