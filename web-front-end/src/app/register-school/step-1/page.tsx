"use client";

import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";
import RegistrationHeader from "@/components/RegistrationHeader";
import { useRegistration } from "@/features/school-registration/hooks/useRegistration";
import type { SchoolCategory } from "@/features/school-registration/types/school.types";
import { DISTRICTS_BY_PROVINCE } from "@/features/school-registration/types/school.types";

const SCHOOL_TYPES: SchoolCategory[] = [
  "Government",
  "Semi-Government",
  "Private",
  "International",
];

const PROVINCES = [
  "Western",
  "Central",
  "Southern",
  "Northern",
  "Eastern",
  "North Western",
  "North Central",
  "Uva",
  "Sabaragamuwa",
];

export default function RegisterSchoolStep1Page() {
  const router = useRouter();
  const { data, updateStep1 } = useRegistration();
  const form = data.step1;

  const availableDistricts = form.region ? DISTRICTS_BY_PROVINCE[form.region] ?? [] : [];

  function handleSaveDraft() {
    console.log("Draft saved locally:", data);
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    router.push("/register-school/step-2");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <RegistrationHeader currentStep={1} />

      <div className="max-w-3xl mx-auto px-6 pt-12 pb-16">
        <h1 className="text-3xl font-bold text-[#1B3A6B] mb-2">Register Your School</h1>
        <p className="text-slate-600 mb-8">
          Set up the primary administrative credentials for your school&apos;s management
          portal.
        </p>

        <form onSubmit={handleNext}>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <GraduationCap className="w-5 h-5 text-[#1B3A6B]" />
              <h2 className="font-bold text-[#1B3A6B]">School Details</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1.5">
                  School Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.schoolName}
                  onChange={(e) => updateStep1({ schoolName: e.target.value })}
                  placeholder="e.g. Royal Academy International"
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1.5">
                    School Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.schoolType}
                    onChange={(e) =>
                      updateStep1({ schoolType: e.target.value as SchoolCategory })
                    }
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    {SCHOOL_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1.5">
                    Official School Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.officialEmail}
                    onChange={(e) => updateStep1({ officialEmail: e.target.value })}
                    placeholder="admin@school.edu"
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1.5">
                    Principal Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.principalName}
                    onChange={(e) => updateStep1({ principalName: e.target.value })}
                    placeholder="Full Name"
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1.5">
                    School Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.contactNumber}
                    onChange={(e) => updateStep1({ contactNumber: e.target.value })}
                    placeholder="+94 XX XXX XXXX"
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1.5">
                    Region <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.region}
                    onChange={(e) => {
                      updateStep1({ region: e.target.value, district: "" });
                    }}
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select Province</option>
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1.5">
                    City / District <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.district}
                    onChange={(e) => updateStep1({ district: e.target.value })}
                    required
                    disabled={!form.region}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option value="">
                      {form.region ? "e.g. Colombo" : "Select province first"}
                    </option>
                    {availableDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1.5">
                    Student Count <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.studentCount}
                    onChange={(e) => updateStep1({ studentCount: e.target.value })}
                    placeholder="0"
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1.5">
                    Teacher Count <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.teacherCount}
                    onChange={(e) => updateStep1({ teacherCount: e.target.value })}
                    placeholder="0"
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Save Draft
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

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4 flex gap-3">
            <span className="text-teal-600 shrink-0">ⓘ</span>
            <p className="text-sm text-slate-600">
              Your information is securely handled and used for verification purposes
              only.
            </p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 flex gap-3">
            <span className="text-teal-600 shrink-0">?</span>
            <p className="text-sm text-slate-600">
              Need help? Contact our{" "}
              <a href="#" className="text-teal-600 underline font-medium">
                support team
              </a>{" "}
              for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}