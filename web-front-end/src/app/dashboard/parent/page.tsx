"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/userAuth";

export default function ParentDashboardPage() {
  const { user, isInitialized, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace("/login");
    }
  }, [isInitialized, user, router]);

  if (!isInitialized || !user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-surface p-8 text-on-surface">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-on-surface-variant">Parent portal</p>
            <h1 className="text-3xl font-semibold">Welcome, {user.fullName}</h1>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold"
          >
            Log out
          </button>
        </div>
        <section className="rounded-xl border border-outline-variant bg-surface-container-low p-6">
          <h2 className="text-xl font-semibold">Parent dashboard</h2>
          <p className="mt-2 text-on-surface-variant">
            Your parent account is signed in successfully.
          </p>
        </section>
      </div>
    </main>
  );
}
