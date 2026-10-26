export type OnboardingStatus =
  | "NO_SCHOOL"
  | "PENDING_APPROVAL"
  | "REJECTED"
  | "ACTIVE";

/** Where a School Admin goes after login if the account is not ACTIVE yet. */
export const ONBOARDING_ROUTES: Record<Exclude<OnboardingStatus, "ACTIVE">, string> = {
  NO_SCHOOL: "/register-school/step-1",
  PENDING_APPROVAL: "/register-school/success",
  REJECTED: "/register-school/success",
};