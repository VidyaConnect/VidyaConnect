"use client";

import { useEffect } from "react";
import { Settings2 } from "lucide-react";
import type { RegType } from "../types";
import { REG_COPY } from "../utils/constants";
import { useBulkRegistration } from "../hooks/useBulkRegistrationWizard";
import WizardProgress from "./WizardProgress";
import { StepSelectType } from "./StepSelectType";
import { StepUpload } from "./StepUpload";
import { StepValidate } from "./StepValidate";
import { ImportConfirmation } from "./ImportConfirmation";
import { RegistrationResult } from "./RegistrationResult";
import { ClassResult } from "./ClassResult";

export default function RegistrationWizard({
  initialType,
  academicYear,
  startAtUpload,
  onExit,
}: {
  initialType?: RegType;
  academicYear?: string;
  startAtUpload?: boolean;
  onExit?: () => void;
}) {
  const w = useBulkRegistration(initialType, academicYear);

  // Skip step 1: the type was already chosen on the landing page.
  useEffect(() => {
    if (startAtUpload) w.goUpload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#073b78] to-[#0a56a8] px-6 py-5 text-white shadow-sm sm:px-7">
        <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-12 right-24 h-28 w-28 rounded-full bg-[#00a896]/30" />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <Settings2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">School setup</h1>
              <p className="mt-0.5 text-sm text-white/75">
                Add classes, teachers or students from a CSV or Excel file.
              </p>
            </div>
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold">
            Importing: {REG_COPY[w.type].label}
          </span>
        </div>
      </header>

      <WizardProgress current={w.step} />

      {w.error && w.step !== "confirm" && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {w.error}
        </div>
      )}

      <div className="rounded-2xl border border-[#e2e6ee] bg-white p-6 shadow-sm">
        {w.step === "type" && (
          <StepSelectType type={w.type} onChange={w.selectType} onNext={w.goUpload} />
        )}

        {w.step === "upload" && (
          <StepUpload
            type={w.type}
            file={w.file}
            fileError={w.fileError}
            academicYear={w.academicYear}
            loading={w.loading}
            canValidate={w.canValidate}
            onYear={w.setAcademicYear}
            onFile={w.chooseFile}
            onBack={startAtUpload && onExit ? onExit : w.back}
            onNext={w.validate}
          />
        )}

        {w.step === "validate" && (
          <StepValidate type={w.type} rows={w.rows} onBack={w.back} onNext={w.goConfirm} />
        )}

        {w.step === "confirm" && (
          <ImportConfirmation
            type={w.type}
            rows={w.rows}
            submitting={w.loading}
            error={w.error}
            onBack={w.back}
            onConfirm={w.run}
          />
        )}

        {w.step === "result" &&
          w.outcome &&
          (w.type === "class" ? (
            <ClassResult result={w.outcome} onAgain={w.reset} onDone={onExit ?? w.reset} />
          ) : (
            <RegistrationResult
              type={w.type}
              result={w.outcome}
              onAgain={w.reset}
              onDone={onExit ?? w.reset}
            />
          ))}
      </div>
    </div>
  );
}