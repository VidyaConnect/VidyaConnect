"use client";

import { useState } from "react";
import type { PreviewRow, RegType } from "../types";
import {
  previewImport,
  runImport,
  type ImportOutcome,
} from "../services/bulkRegistrationService";

export type WizardStep = "type" | "upload" | "validate" | "confirm" | "result";

const MAX_FILE_BYTES = 2 * 1024 * 1024;

const BACK: Record<WizardStep, WizardStep> = {
  type: "type",
  upload: "type",
  validate: "upload",
  confirm: "validate",
  result: "result",
};

function checkFile(file: File): string | null {
  if (!/\.(csv|xlsx)$/i.test(file.name)) return "Please choose a .csv or .xlsx file.";
  if (file.size > MAX_FILE_BYTES) return "The file is larger than 2 MB.";
  return null;
}

export function useBulkRegistration(initialType?: RegType, initialYear?: string) {
  const [step, setStep] = useState<WizardStep>(initialType ? "upload" : "type");
  const [type, setType] = useState<RegType>(initialType ?? "class");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [academicYear, setAcademicYear] = useState(initialYear ?? "");
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [outcome, setOutcome] = useState<ImportOutcome | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearData = () => {
    setFile(null);
    setFileError(null);
    setRows([]);
    setOutcome(null);
    setError(null);
  };

  // Picking a type only selects it. The Continue button moves on.
  const selectType = (t: RegType) => {
    if (t !== type) clearData();
    setType(t);
  };

  const goUpload = () => {
    setError(null);
    setStep("upload");
  };

  const chooseFile = (f: File | null) => {
    setError(null);
    if (!f) {
      setFile(null);
      setFileError(null);
      return;
    }
    const problem = checkFile(f);
    setFileError(problem);
    setFile(problem ? null : f);
  };

  // Ask the backend to check the file (nothing is saved yet)
  const validate = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await previewImport(type, file, academicYear);
      setRows(res.rows);
      setStep("validate");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const goConfirm = () => {
    setError(null);
    setStep("confirm");
  };

  // Really register. The confirm screen already says rows with errors are skipped,
  // so skipInvalid is always true here.
  const run = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      setOutcome(await runImport(type, file, academicYear, true));
      setStep("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const back = () => {
    setError(null);
    setStep(BACK[step]);
  };

  // "Import another file": go back to the upload step if a type was preselected.
  const reset = () => {
    clearData();
    setStep(initialType ? "upload" : "type");
  };

  // Classes and students always need the year; teachers only if they assign a class.
  const canValidate =
    !!file && !fileError && (type === "teacher" || academicYear.trim() !== "");

  return {
    step, type, file, fileError, academicYear, setAcademicYear,
    rows, outcome, loading, error, canValidate,
    selectType, goUpload, chooseFile, validate, goConfirm, run, back, reset,
  };
}