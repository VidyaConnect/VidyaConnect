"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/userAuth";

export default function StudentDashboard() {
  const router = useRouter();
  const { user, isInitialized, logout } = useAuth();

  useEffect(() => {
    if (isInitialized && (!user || user.role !== "STUDENT")) router.replace("/login");
  }, [isInitialized, user, router]);

  if (!isInitialized || !user || user.role !== "STUDENT") return null;

  return <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
    <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">VidyaConnect Student</p>
    <h1 className="mt-3 text-3xl font-bold text-slate-900">Welcome, {user.fullName}</h1>
    <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Assignments are available in the parent mobile app</h2>
      <p className="mt-3 leading-7 text-slate-600">Review assigned work and progress with your parent in My Assignments. Complete the work at home and hand your answer sheets to your teacher at school. Online student submissions are not used.</p>
    </section>
    <button onClick={() => { logout(); router.replace("/login"); }} className="mt-6 rounded-lg bg-[#073b78] px-5 py-3 font-semibold text-white">Log out</button>
  </main>;
}
