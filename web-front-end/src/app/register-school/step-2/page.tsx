"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, Circle } from "lucide-react";
import RegistrationHeader from "@/components/RegistrationHeader";
import { useRegistration } from "@/features/school-registration/hooks/useRegistration";

const PASSWORD_RULES: { label: string; test: (pw: string) => boolean }[] = [
  { label: "8 characters", test: (pw) => pw.length >= 8 },
  { label: "Uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "Lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "Include number", test: (pw) => /[0-9]/.test(pw) },
  { label: "Special character (@, $, !, %, *, ?, &)", test: (pw) => /[@$!%*?&]/.test(pw) },
];

export default function RegisterSchoolStep2Page() {
  const router = useRouter();
  const { data, updateStep2 } = useRegistration();
  const form = data.step2;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const passwordChecks = PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.test(form.password),
  }));
  const passwordValid = passwordChecks.every((c) => c.passed);
  const passwordsMatch =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;

  function handleBack() {
    router.push("/register-school/step-1");
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);

    if (!passwordValid || !passwordsMatch || !form.termsAccepted) {
      return;
    }

    router.push("/register-school/step-3");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <RegistrationHeader currentStep={2} />

      <div className="max-w-3xl mx-auto px-6 pt-12 pb-16">
        <h1 className="text-3xl font-bold text-[#1B3A6B] mb-2 text-center">
          School Administrator Account
        </h1>
        <p className="text-slate-600 mb-8 text-center">
          Set up the primary administrative credentials for your school&apos;s management
          portal.
        </p>

        <form onSubmit={handleNext}>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6 pb-4 border-b border-slate-100">
              <h2 className="font-bold text-[#1B3A6B]">Create Admin Account</h2>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1.5">
                    Admin First Name
                  </label>
                  <input
                    type="text"
                    value={form.adminFirstName}
                    onChange={(e) => updateStep2({ adminFirstName: e.target.value })}
                    placeholder="e.g. Jane"
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1.5">
                    Admin Last Name
                  </label>
                  <input
                    type="text"
                    value={form.adminLastName}
                    onChange={(e) => updateStep2({ adminLastName: e.target.value })}
                    placeholder="e.g. Doe"
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1.5">
                    Admin Email (login email)
                  </label>
                  <input
                    type="email"
                    value={form.adminEmail}
                    onChange={(e) => updateStep2({ adminEmail: e.target.value })}
                    placeholder="admin@school.edu"
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1.5">
                    Admin Phone
                  </label>
                  <input
                    type="tel"
                    value={form.adminPhone}
                    onChange={(e) => updateStep2({ adminPhone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  Admin Role
                </label>
                <div className="border border-teal-600 bg-slate-50 rounded-lg p-4 flex items-start gap-3">
                  <span className="mt-0.5 w-4 h-4 rounded-full border-2 border-teal-600 flex items-center justify-center shrink-0">
                    <span className="w-2 h-2 rounded-full bg-teal-600" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      School Administrator
                    </p>
                    <p className="text-sm text-slate-500 italic">
                      Default read/write access for account setup.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <h2 className="font-bold text-[#1B3A6B] mb-5">Password Section</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1.5">
                    Create Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => updateStep2({ password: e.target.value })}
                      required
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 pr-11 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-2 gap-y-2 gap-x-6">
                  {passwordChecks.map((rule) => (
                    <div key={rule.label} className="flex items-center gap-2 text-sm">
                      {rule.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                      )}
                      <span className={rule.passed ? "text-slate-700" : "text-slate-500"}>
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) => updateStep2({ confirmPassword: e.target.value })}
                      required
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 pr-11 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {submitted && form.confirmPassword.length > 0 && !passwordsMatch && (
                    <p className="text-xs text-red-500 mt-1.5">Passwords do not match.</p>
                  )}
                </div>
              </div>

              <label className="flex items-start gap-2.5 mt-6 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.termsAccepted}
                  onChange={(e) => updateStep2({ termsAccepted: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>
                  I accept the{" "}
                  <a href="#" className="text-teal-600 underline font-medium">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-teal-600 underline font-medium">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
              {submitted && !form.termsAccepted && (
                <p className="text-xs text-red-500 mt-1.5">
                  You must accept the terms to continue.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                ‹ Back
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6 tracking-wide uppercase flex items-center justify-center gap-1.5">
          🔒 Enterprise Grade Security Encryption
        </p>
      </div>
    </div>
  );
}