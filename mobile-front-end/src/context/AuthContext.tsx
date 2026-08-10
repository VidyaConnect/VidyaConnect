// src/context/AuthContext.tsx
import React, { createContext, useContext, useMemo, useState } from "react";
import { loginUser } from "../features/auth/services/authApi";
import { saveTokens, clearTokens } from "../features/auth/services/tokenStorage";
import type { User, School } from "../features/auth/types/auth.types";

interface AuthContextProps {
  user: User | null;
  school: School | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loginUser({ email, password });
      await saveTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      setSchool(data.school);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Login failed. Please try again.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await clearTokens();
    setUser(null);
    setSchool(null);
  };

  const value = useMemo(
    () => ({ user, school, isLoading, error, login, logout }),
    [user, school, isLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}