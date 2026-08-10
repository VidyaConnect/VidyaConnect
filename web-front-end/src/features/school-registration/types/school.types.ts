export type SchoolCategory = "Government" | "Semi-Government" | "Private" | "International";
export type AdminRole = "SCHOOL_ADMIN";

export interface SchoolDetailsData {
  schoolName: string;
  schoolType: SchoolCategory | "";
  officialEmail: string;
  principalName: string;
  contactNumber: string;
  region: string;
  district: string;
  studentCount: string;
  teacherCount: string;
}

export interface AdminAccountData {
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPhone: string;
  adminRole: AdminRole;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export interface DocumentsData {
  verificationDocument: File | null;
  confirmAccuracy: boolean;
}

export interface RegistrationWizardData {
  step1: SchoolDetailsData;
  step2: AdminAccountData;
  step3: DocumentsData;
  submissionResult: RegistrationSubmissionResponse | null;
}

export const DISTRICTS_BY_PROVINCE: Record<string, string[]> = {
  Western: ["Colombo", "Gampaha", "Kalutara"],
  Central: ["Kandy", "Matale", "Nuwara Eliya"],
  Southern: ["Galle", "Matara", "Hambantota"],
  Northern: ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
  Eastern: ["Ampara", "Batticaloa", "Trincomalee"],
  "North Western": ["Kurunegala", "Puttalam"],
  "North Central": ["Anuradhapura", "Polonnaruwa"],
  Uva: ["Badulla", "Monaragala"],
  Sabaragamuwa: ["Ratnapura", "Kegalle"],
};

export interface RegistrationSubmissionResponse {
  admissionId: string;
  status: "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  estimatedWaitHours: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}