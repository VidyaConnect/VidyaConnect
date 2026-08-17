"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Headset, Lock, X, Mail, Phone } from "lucide-react";
import RegistrationHeader from "@/components/RegistrationHeader";
import { useRegistration } from "@/features/school-registration/hooks/useRegistration";

const NEXT_STEPS = [
  {
    title: "Verification Process",
    description: "Our administrative team will audit the uploaded documents for institutional compliance.",
  },
  {
    title: "Approval Notification",
    description: "You will receive an automated approval email once your school portal is provisioned.",
  },
  {
    title: "Dashboard Access",
    description: "Log in to begin setting up your faculty, curriculum, and student databases.",
  },
];

export default function RegistrationSuccessPage() {
  const router = useRouter();
  const { data, reset } = useRegistration();
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // TEMPORARY: fallback so the page can be previewed directly without going through the wizard.
  // Remove this fallback once the real backend is wired up, and restore the redirect guard below.
  const result = data.submissionResult ?? {
    admissionId: "PREVIEW-0000",
    status: "UNDER_REVIEW" as const,
    estimatedWaitHours: 24,
  };

  function handleBackToHome() {
    reset();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <RegistrationHeader currentStep={3} />

      <div className="max-w-2xl mx-auto px-6 pt-12 pb-16">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-teal-50 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-teal-600" strokeWidth={2} />
          </div>

          <h1 className="text-2xl font-bold text-[#1B3A6B] text-center mb-2">
            Thank you for registering!
          </h1>
          <p className="text-sm text-slate-600 text-center leading-relaxed mb-6">
            Your application is being processed. Document verification is in progress,
            typically requiring a <strong className="text-slate-800">{result.estimatedWaitHours}</strong> hour
            wait time.
          </p>

          <div className="border border-slate-200 rounded-lg mb-8">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Admission ID
                </p>
                <p className="text-sm font-semibold text-teal-600">#{result.admissionId}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase mb-1">
                  Status
                </p>
                <StatusBadge status={result.status} />
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
              <span className="text-sm text-slate-700">Estimated Wait:</span>
              <span className="text-sm font-semibold text-orange-500">
                {result.estimatedWaitHours} hours
              </span>
            </div>
          </div>

          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase mb-3">
            Next Steps
          </p>
          <div className="border-t border-slate-100">
            {NEXT_STEPS.map((step, i) => {
              const stepNumber = i + 1;
              const isActive = stepNumber === 1;
              return (
                <div key={step.title} className="flex gap-3 py-4 border-b border-slate-50 last:border-0">
                  <span
                    className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      isActive
                        ? "bg-teal-700 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {stepNumber}
                  </span>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        isActive ? "text-slate-800" : "text-slate-400"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p
                      className={`text-sm leading-relaxed ${
                        isActive ? "text-slate-600" : "text-slate-400"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <button
            onClick={handleBackToHome}
            className="border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium px-3 py-2.5 rounded-lg transition-colors"
          >
            Back to Home
          </button>
          <button
            disabled
            className="inline-flex items-center justify-center gap-1.5 border border-slate-200 bg-slate-100 text-slate-400 text-sm font-medium px-3 py-2.5 rounded-lg cursor-not-allowed"
          >
            <Lock className="w-3.5 h-3.5" />
            Sign In
          </button>
          <button
            onClick={() => setIsSupportOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium px-3 py-2.5 rounded-lg transition-colors"
          >
            <Headset className="w-3.5 h-3.5" />
            Contact Support
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          Refer to your Admission ID #{result.admissionId} for any future inquiries.
        </p>
      </div>

      {isSupportOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={() => setIsSupportOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-sm p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsSupportOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-teal-50 flex items-center justify-center">
              <Headset className="w-6 h-6 text-teal-600" strokeWidth={2} />
            </div>

            <h2 className="text-lg font-bold text-[#1B3A6B] text-center mb-1">
              Contact Support
            </h2>
            <p className="text-sm text-slate-500 text-center mb-6">
              Reach out to us using the details below.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 border border-slate-200 rounded-lg px-4 py-3">
                <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Email</p>
                  <p className="text-sm font-medium text-slate-700">support@vidyaconnect.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 border border-slate-200 rounded-lg px-4 py-3">
                <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Phone</p>
                  <p className="text-sm font-medium text-slate-700">+94 11 234 5678</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: "UNDER_REVIEW" | "APPROVED" | "REJECTED" }) {
  const styles: Record<string, string> = {
    UNDER_REVIEW: "bg-orange-100 text-orange-600",
    APPROVED: "bg-teal-100 text-teal-700",
    REJECTED: "bg-red-100 text-red-600",
  };
  const labels: Record<string, string> = {
    UNDER_REVIEW: "Under Review",
    APPROVED: "Approved",
    REJECTED: "Rejected",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${styles[status]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}