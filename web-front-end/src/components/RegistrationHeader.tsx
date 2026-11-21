"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const TOTAL_STEPS = 2;

interface RegistrationHeaderProps {
  currentStep?: 1 | 2;
  // when false, the right-hand step text and progress dots are not rendered
  showSteps?: boolean;
}

export default function RegistrationHeader({
  currentStep = 1,
  showSteps = true,
}: RegistrationHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-[#1B3A6B] px-6 py-4 flex items-center justify-between">
      <button
        type="button"
        onClick={() => router.push("/")}
        className="inline-flex items-center gap-2 text-sm font-medium text-white bg-white/15 hover:bg-white/25 border border-white/25 rounded-lg px-4 py-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      {showSteps ? (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
              <span
                key={step}
                className={`h-1 w-8 rounded-full transition-colors ${
                  step <= currentStep ? "bg-teal-400" : "bg-white/25"
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div aria-hidden className="w-0 md:w-1/4" />
      )}
    </div>
  );
}