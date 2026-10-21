"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RegistrationHeader from "@/components/RegistrationHeader";
import { useRegistration } from "@/features/school-registration/hooks/useRegistration";

export default function RegisterSchoolStep2Page() {
  const router = useRouter();
  const { data, updateStep2 } = useRegistration();
  const form = data.step2;

  const [submitted, setSubmitted] = useState(false);

  function handleBack() {
    router.push("/register-school/step-1");
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);

    if (!form.termsAccepted) {
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
          Set up the primary administrative contact for your school&apos;s management
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
              <label className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer">
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