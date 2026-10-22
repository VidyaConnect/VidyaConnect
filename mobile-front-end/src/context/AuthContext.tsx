import React, { createContext, useContext, useMemo, useState } from "react";
import { UserProfile, UserRole } from "../types";

interface AuthContextProps {
  user: UserProfile | null;
  loginAs: (role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const initialUser: UserProfile | null = null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(initialUser);

  const loginAs = async (role: UserRole) => {
    const profile: UserProfile = {
      id: "user-1",
      name: role === "teacher" ? "Ms. Perera" : role === "parent" ? "Nithi Fernando" : "School Admin",
      role
    };
    setUser(profile);
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loginAs, logout }),
    [user]
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
