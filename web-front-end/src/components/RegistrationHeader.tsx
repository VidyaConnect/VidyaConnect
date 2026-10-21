"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface RegistrationHeaderProps {
  // currentStep is optional so existing callers that pass it keep working
  currentStep?: 1 | 2 | 3;
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
          <span className="text-sm font-medium text-white">Step {currentStep} of 3</span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((step) => (
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
        // preserve layout spacing so header always has two sides (left button + right empty space)
        <div aria-hidden className="w-0 md:w-1/4" />
      )}
    </div>
  );
}