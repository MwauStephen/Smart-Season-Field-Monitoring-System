"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, LoginCredentials } from "@/types/auth";
import { authService } from "@/lib/services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isAgent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("croplens_user");
    const savedToken = localStorage.getItem("croplens_token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const data = await authService.login(credentials);
      localStorage.setItem("croplens_token", data.token);
      localStorage.setItem("croplens_user", JSON.stringify(data.user));
      setUser(data.user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      toast.success("You have been logged out safely.");
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  const isAdmin = user?.role === "admin";
  const isAgent = user?.role === "agent";

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isAgent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
