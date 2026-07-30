"use client";

import { createContext, useState, ReactNode } from "react";
import type { User, LoginRequest, LoginResponseData } from "../types/auth.types";
import { loginUser } from "../services/authApi";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponseData>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function login(credentials: LoginRequest): Promise<LoginResponseData> {
    setIsLoading(true);
    try {
      const response = await loginUser(credentials);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      setUser(response.user);
      return response;
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}