// src/features/auth/components/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/userAuth";
import type { UserRole } from "../types/auth.types";

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [role, setRole] = useState<UserRole>("SuperAdmin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password, role });
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid email, password, or role. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-100 p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Select Portal Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="SuperAdmin">Super Admin</option>
            <option value="SchoolAdmin">School Admin</option>
            <option value="Teacher">Teacher</option>
          </select>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@vidyaconnect.edu"
              required
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="text-right">
          <a href="#" className="text-sm text-teal-600 hover:underline">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {isLoading ? "Logging in..." : "Login to Account"}
        </button>
      </form>
    </div>
  );
}
