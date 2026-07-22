"use client";

import { createContext, useState, ReactNode } from "react";
import type { User, LoginRequest } from "../types/auth.types";
import { loginUser } from "../services/authApi";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function login(credentials: LoginRequest) {
    setIsLoading(true);
    try {
      const response = await loginUser(credentials);
      // ASSUMPTION — CONFIRM WITH SEHAJINIE: delete this line if backend uses httpOnly cookies
      localStorage.setItem("token", response.token);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
