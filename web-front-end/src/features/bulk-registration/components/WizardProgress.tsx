import { CheckCircle2 } from "lucide-react";
import { WIZARD_STEPS } from "../utils/constants";
import { NAVY } from "../utils/styles";
import type { WizardStep } from "../hooks/useBulkRegistrationWizard";

// Same order as the steps in the hook
const ORDER: WizardStep[] = ["type", "upload", "validate", "confirm", "result"];

export default function WizardProgress({ current }: { current: WizardStep }) {
  const step = ORDER.indexOf(current) + 1; // 1..5

  return (
    <>
      <ol className="mb-3 flex items-center" aria-label="Progress">
        {WIZARD_STEPS.map((s, i) => {
          const n = i + 1;
          const done = n < step;
          const cur = n === step;
          return (
            <li
              key={s}
              className="flex flex-1 items-center last:flex-none"
              aria-current={cur ? "step" : undefined}
            >
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                  done
                    ? "bg-[#006A61] text-white"
                    : cur
                      ? "bg-[#1B3A6B] text-white"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : n}
              </span>
              <span
                className={`ml-2 hidden text-sm md:inline ${
                  cur ? `font-semibold ${NAVY}` : "text-slate-500"
                }`}
              >
                {s}
              </span>
              {n < WIZARD_STEPS.length && (
                <span
                  className={`mx-3 h-px flex-1 ${
                    done ? "bg-[#006A61]" : "bg-slate-300"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
      <p className="mb-4 text-sm font-medium text-slate-600 md:hidden">
        Step {step} of {WIZARD_STEPS.length}: {WIZARD_STEPS[step - 1]}
      </p>
    </>
  );
}