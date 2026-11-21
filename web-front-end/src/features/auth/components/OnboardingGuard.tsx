"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/userAuth";
import { getMe } from "../services/authApi";
import { roleHome } from "../roleRoutes";
import type { OnboardingStatus } from "../utils/onboarding";

const SUCCESS_PATH = "/register-school/success";
const FIRST_STEP_PATH = "/register-school/step-1";

/** Returns the page to redirect to, or null if the user may stay here. */
function getRedirect(
  status: OnboardingStatus,
  pathname: string,
  activeHome: string | undefined
): string | null {
  const onSuccessPage = pathname.startsWith(SUCCESS_PATH);

  if (status === "ACTIVE") return activeHome ?? "/";
  if (status === "NO_SCHOOL") return onSuccessPage ? FIRST_STEP_PATH : null;
  // PENDING_APPROVAL or REJECTED: only the status page is allowed
  return onSuccessPage ? null : SUCCESS_PATH;
}

export default function OnboardingGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isInitialized } = useAuth();
  const [state, setState] = useState<"loading" | "allowed" | "error">("loading");
  const [errorText, setErrorText] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!isInitialized) return;

    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "SCHOOL_ADMIN") {
      router.replace("/");
      return;
    }

    let cancelled = false;
    setState("loading");

    getMe()
      .then((me) => {
        if (cancelled) return;
        const target = getRedirect(me.onboardingStatus, pathname, roleHome[user.role]);
        if (target) router.replace(target);
        else setState("allowed");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Onboarding status check failed:", err);

        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.replace("/login"); // the token is really not valid
          return;
        }

        const code = axios.isAxiosError(err) ? err.response?.status : undefined;
        const detail = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
        setErrorText(
          `${detail || "Could not reach the server."}${code ? ` (error ${code})` : ""}`
        );
        setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [isInitialized, user, pathname, router, attempt]);

  if (state === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-600" aria-hidden="true" />
          <h1 className="mb-1 text-lg font-bold text-[#1B3A6B]">
            We could not check your registration status
          </h1>
          <p className="mb-5 text-sm text-slate-600">{errorText}</p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setAttempt((a) => a + 1)}
              className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => router.replace("/login")}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state !== "allowed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-teal-700" aria-label="Loading" />
      </div>
    );
  }

  return <>{children}</>;
}