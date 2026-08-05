"use client";

import { createContext, useState, ReactNode } from "react";
import type {
  RegistrationWizardData,
  SchoolDetailsData,
  AdminAccountData,
  DocumentsData,
  RegistrationSubmissionResponse,
} from "../types/school.types";

const emptyStep1: SchoolDetailsData = {
  schoolName: "",
  schoolType: "",
  officialEmail: "",
  principalName: "",
  contactNumber: "",
  region: "",
  district: "",
  studentCount: "",
  teacherCount: "",
};

const emptyStep2: AdminAccountData = {
  adminFirstName: "",
  adminLastName: "",
  adminEmail: "",
  adminPhone: "",
  adminRole: "SCHOOL_ADMIN",
  password: "",
  confirmPassword: "",
  termsAccepted: false,
};

const emptyStep3: DocumentsData = {
  verificationDocument: null,
  confirmAccuracy: false,
};

export interface RegistrationContextType {
  data: RegistrationWizardData;
  updateStep1: (values: Partial<SchoolDetailsData>) => void;
  updateStep2: (values: Partial<AdminAccountData>) => void;
  updateStep3: (values: Partial<DocumentsData>) => void;
  setSubmissionResult: (result: RegistrationSubmissionResponse) => void;
  reset: () => void;
}

export const RegistrationContext = createContext<RegistrationContextType | undefined>(
  undefined
);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<RegistrationWizardData>({
    step1: emptyStep1,
    step2: emptyStep2,
    step3: emptyStep3,
    submissionResult: null,
  });

  function updateStep1(values: Partial<SchoolDetailsData>) {
    setData((prev) => ({ ...prev, step1: { ...prev.step1, ...values } }));
  }

  function updateStep2(values: Partial<AdminAccountData>) {
    setData((prev) => ({ ...prev, step2: { ...prev.step2, ...values } }));
  }

  function updateStep3(values: Partial<DocumentsData>) {
    setData((prev) => ({ ...prev, step3: { ...prev.step3, ...values } }));
  }

  function setSubmissionResult(result: RegistrationSubmissionResponse) {
    setData((prev) => ({ ...prev, submissionResult: result }));
  }

  function reset() {
    setData({
      step1: emptyStep1,
      step2: emptyStep2,
      step3: emptyStep3,
      submissionResult: null,
    });
  }

  return (
    <RegistrationContext.Provider
      value={{ data, updateStep1, updateStep2, updateStep3, setSubmissionResult, reset }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}