"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Headset,
  LogOut,
  X,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";
import RegistrationHeader from "@/components/RegistrationHeader";
import { useRegistration } from "@/features/school-registration/hooks/useRegistration";
import { useAuth } from "@/features/auth/hooks/userAuth";
import { getMe, type MeResponseData } from "@/features/auth/services/authApi";

type SchoolInfo = NonNullable<MeResponseData["school"]>;

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
  const { reset } = useRegistration();
  const { logout } = useAuth();
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [school, setSchool] = useState<SchoolInfo | null>(null);
  const [loadError, setLoadError] = useState("");

  // Always ask the server, so the status is correct even after a long time
  useEffect(() => {
    let cancelled = false;
    getMe()
      .then((me) => {
        if (!cancelled) setSchool(me.school);
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError("We could not load your application status. Please refresh the page.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleBackToHome() {
    reset();
    router.push("/");
  }

  function handleSignOut() {
    reset();
    logout();
    router.push("/login");
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-50">
        <RegistrationHeader showSteps={false} />
        <p className="max-w-2xl mx-auto px-6 pt-16 text-center text-sm text-red-600">
          {loadError}
        </p>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-700" aria-label="Loading" />
      </div>
    );
  }

  const rejected = school.status === "REJECTED";

  return (
    <div className="min-h-screen bg-slate-50">
      <RegistrationHeader showSteps={false} />

      <div className="max-w-2xl mx-auto px-6 pt-12 pb-16">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div
            className={`w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center ${
              rejected ? "bg-red-50" : "bg-teal-50"
            }`}
          >
            {rejected ? (
              <XCircle className="w-8 h-8 text-red-600" strokeWidth={2} />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-teal-600" strokeWidth={2} />
            )}
          </div>

          <h1 className="text-2xl font-bold text-[#1B3A6B] text-center mb-2">
            {rejected ? "Your registration was not approved" : "Thank you for registering!"}
          </h1>

          {rejected ? (
            <p className="text-sm text-slate-600 text-center leading-relaxed mb-6">
              Unfortunately we could not approve <strong className="text-slate-800">{school.name}</strong>.
              Please contact our support team to find out why and what to do next.
            </p>
          ) : (
            <p className="text-sm text-slate-600 text-center leading-relaxed mb-6">
              Your application for <strong className="text-slate-800">{school.name}</strong> is
              being processed. Document verification is in progress, typically requiring a{" "}
              <strong className="text-slate-800">{school.estimatedWaitHours}</strong> hour wait time.
            </p>
          )}

          <div className="border border-slate-200 rounded-lg mb-8">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Admission ID
                </p>
                <p className="text-sm font-semibold text-teal-600 break-all">#{school.admissionId}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase mb-1">
                  Status
                </p>
                <StatusBadge status={school.status} />
              </div>
            </div>
            {!rejected && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                <span className="text-sm text-slate-700">Estimated Wait:</span>
                <span className="text-sm font-semibold text-orange-500">
                  {school.estimatedWaitHours} hours
                </span>
              </div>
            )}
          </div>

          {!rejected && (
            <>
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
                          isActive ? "bg-teal-700 text-white" : "bg-slate-200 text-slate-500"
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
            </>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <button
            onClick={handleBackToHome}
            className="border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium px-3 py-2.5 rounded-lg transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center justify-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium px-3 py-2.5 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
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
          Refer to your Admission ID #{school.admissionId} for any future inquiries.
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