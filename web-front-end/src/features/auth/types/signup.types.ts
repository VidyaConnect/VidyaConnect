export interface SignUpFormValues {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

export type SignUpFormErrors = Partial<Record<keyof SignUpFormValues, string>>;

/**
 * What is sent to the backend. There is deliberately no `role` field:
 * the server must always create this account as SCHOOL_ADMIN.
 */
export interface SignUpPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}
