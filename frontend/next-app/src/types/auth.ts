export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "agent";
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}
