import type {
  RegistrationWizardData,
  RegistrationSubmissionResponse,
} from "../types/school.types";

export async function registerSchool(
  data: RegistrationWizardData
): Promise<RegistrationSubmissionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    admissionId: crypto.randomUUID(),
    status: "UNDER_REVIEW",
    estimatedWaitHours: "48",
  };
}

export async function saveDraft(
  payload: Partial<RegistrationWizardData>
): Promise<void> {
  console.log("Draft:", payload);
}