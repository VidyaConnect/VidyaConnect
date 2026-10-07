"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/userAuth";
import { roleHome } from "@/features/auth/roleRoutes";

// URL section -> role allowed to see it
const sectionRoles: Record<string, string> = {
  "teacher": "TEACHER",
  "school-admin": "SCHOOL_ADMIN",
  "admin": "ADMIN",
};


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const section = pathname.split("/")[2]; // /dashboard/<section>
  const requiredRole = section ? sectionRoles[section] : undefined;

  useEffect(() => {
    if (!isInitialized || !requiredRole) return;
    if (!user) {
      router.replace("/login");
    } else if (user.role !== requiredRole) {
      router.replace(roleHome[user.role] ?? "/login");
    }
  }, [isInitialized, user, requiredRole, router]);

  // Show nothing until we know the user is allowed here
  if (requiredRole && (!isInitialized || !user || user.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}