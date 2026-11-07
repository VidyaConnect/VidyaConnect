"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import type { User, LoginRequest, LoginResponseData } from "../types/auth.types";
import { loginUser } from "../services/authApi";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponseData>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Restore the logged-in user after a page refresh
  useEffect(() => {
    try {
      const token = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem("user");
    }
    setIsInitialized(true);
  }, []);

  async function login(credentials: LoginRequest): Promise<LoginResponseData> {
    setIsLoading(true);
    try {
      const response = await loginUser(credentials);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
      return response;
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isInitialized, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}