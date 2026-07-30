// src/features/auth/components/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/userAuth";

const roleRedirects: Record<string, string> = {
  ADMIN: "/dashboard",
  SCHOOL_ADMIN: "/dashboard",
  TEACHER: "/dashboard",
};

export default function LoginForm() {
  const router = useRouter();
  const { login, logout, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const response = await login({ email, password });
      const destination = roleRedirects[response.user.role];

      if (!destination) {
        logout();
        setError("This account doesn't have access to the web portal. Please use the mobile app.");
        return;
      }

      router.push(destination);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="font-label-md text-sm font-semibold text-on-surface">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@vidyaconnect.edu"
            required
            className="w-full h-12 pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="password" className="font-label-md text-sm font-semibold text-on-surface">
            Password
          </label>
          <a href="#" className="text-primary text-sm font-semibold hover:underline">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full h-12 pl-10 pr-10 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:brightness-110 active:scale-[0.98] disabled:opacity-60 transition-all shadow-md"
      >
        {isLoading ? "Logging in..." : "Sign In to Portal"}
      </button>
    </form>
  );
}