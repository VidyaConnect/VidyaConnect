"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/userAuth";
import { roleHome } from "@/features/auth/roleRoutes";

export default function DashboardIndex() {
  const { user, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;
    router.replace(user ? roleHome[user.role] ?? "/login" : "/login");
  }, [isInitialized, user, router]);

  return null;
}