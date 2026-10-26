"use client";

import {
  useMemo,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from "react";
import { registerSchoolAdmin } from "../services/signup.service";
import { useAuth } from "./userAuth";
import type {
  SignUpFormErrors,
  SignUpFormValues,
} from "../types/signup.types";

export const MIN_PASSWORD_LENGTH = 8;

const INITIAL_VALUES: SignUpFormValues = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  acceptedTerms: false,
};

function validate(values: SignUpFormValues): SignUpFormErrors {
  const errors: SignUpFormErrors = {};

  if (values.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full name.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!/^\+?[\d\s-]{9,15}$/.test(values.phone.trim())) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (values.confirmPassword !== values.password || !values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!values.acceptedTerms) {
    errors.acceptedTerms = "Please accept the terms to continue.";
  }

  return errors;
}

export function useSignUpForm(onSuccess: () => void) {
  const { login } = useAuth();

  const [values, setValues] = useState<SignUpFormValues>(INITIAL_VALUES);
  const [touched, setTouched] = useState<Partial<Record<keyof SignUpFormValues, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const errors = useMemo(() => validate(values), [values]);

  // Only show an error after the user has touched the field or tried to submit.
  const errorFor = (field: keyof SignUpFormValues) =>
    touched[field] || submitted ? errors[field] : undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setServerError(null);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const name = event.target.name as keyof SignUpFormValues;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setServerError(null);

    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const email = values.email.trim().toLowerCase();

      // Step 1: create the account
      await registerSchoolAdmin({
        fullName: values.fullName.trim(),
        email,
        phone: values.phone.trim(),
        password: values.password,
      });

      // Step 2: log the user in, so the next pages work
      try {
        await login({ email, password: values.password });
      } catch {
        throw new Error(
          "Your account was created, but automatic sign in failed. Please sign in from the login page."
        );
      }

      onSuccess();
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    values,
    errorFor,
    submitting,
    serverError,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}