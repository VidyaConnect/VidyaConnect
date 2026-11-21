"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FocusEvent, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
  type LucideIcon,
} from "lucide-react";
import { useSignUpForm } from "../hooks/useSignUpForm";
import type { SignUpFormValues } from "../types/signup.types";

// Existing school registration flow: the next step after the account is created.
const NEXT_STEP_PATH = "/register-school/step-1";

interface TextFieldProps {
  name: keyof SignUpFormValues;
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  autoComplete?: string;
  icon: LucideIcon;
  error?: string;
  trailing?: ReactNode;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
}

function TextField({
  name,
  label,
  type = "text",
  value,
  placeholder,
  autoComplete,
  icon: Icon,
  error,
  trailing,
  onChange,
  onBlur,
}: TextFieldProps) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-[#1B3A6B] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
          aria-hidden="true"
        />
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-xl border bg-white py-3 pl-11 ${
            trailing ? "pr-12" : "pr-4"
          } text-base text-slate-800 placeholder:text-slate-400 outline-none transition focus:ring-4 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-slate-300 focus:border-teal-600 focus:ring-teal-100"
          }`}
        />
        {trailing && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</div>
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    values,
    errorFor,
    submitting,
    serverError,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useSignUpForm(() => router.push(NEXT_STEP_PATH));

  const hasMinLength = values.password.length >= 8;
  const passwordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword((v) => !v)}
      aria-label={showPassword ? "Hide password" : "Show password"}
      className="p-2 rounded-lg text-slate-500 hover:text-[#1B3A6B] hover:bg-slate-100 transition-colors"
    >
      {showPassword ? (
        <EyeOff className="w-5 h-5" aria-hidden="true" />
      ) : (
        <Eye className="w-5 h-5" aria-hidden="true" />
      )}
    </button>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <p>{serverError}</p>
        </div>
      )}

      <TextField
        name="fullName"
        label="Full name"
        value={values.fullName}
        placeholder="e.g. Nimali Perera"
        autoComplete="name"
        icon={User}
        error={errorFor("fullName")}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <div className="grid sm:grid-cols-2 gap-5">
        <TextField
          name="email"
          label="Email address"
          type="email"
          value={values.email}
          placeholder="you@school.lk"
          autoComplete="email"
          icon={Mail}
          error={errorFor("email")}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <TextField
          name="phone"
          label="Phone number"
          type="tel"
          value={values.phone}
          placeholder="07X XXX XXXX"
          autoComplete="tel"
          icon={Phone}
          error={errorFor("phone")}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <div>
        <TextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={values.password}
          placeholder="Create a strong password"
          autoComplete="new-password"
          icon={Lock}
          error={errorFor("password")}
          trailing={passwordToggle}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        {/* Password requirement */}
         <div aria-live="polite" className={`mt-3 flex items-center gap-1.5 text-xs ${
            hasMinLength ? "text-teal-700" : "text-slate-500"
          }`}>
          <span
            className={`w-4 h-4 rounded-full flex items-center justify-center ${
            hasMinLength ? "bg-teal-600 text-white" : "bg-slate-200 text-transparent"
            }`} >
            <Check className="w-3 h-3" aria-hidden="true" />
          </span>
          At least 8 characters
        </div>
      </div>

      <TextField
        name="confirmPassword"
        label="Confirm password"
        type={showPassword ? "text" : "password"}
        value={values.confirmPassword}
        placeholder="Re-enter your password"
        autoComplete="new-password"
        icon={Lock}
        error={errorFor("confirmPassword")}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <div>
        <label className="flex items-start gap-3 text-sm text-slate-600 leading-snug cursor-pointer">
          <input
            type="checkbox"
            name="acceptedTerms"
            checked={values.acceptedTerms}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errorFor("acceptedTerms"))}
            className="mt-0.5 w-5 h-5 shrink-0 rounded border-slate-300 accent-teal-700"
          />
          <span>
            I agree to the{" "}
            <Link href="#" className="font-semibold text-[#1B3A6B] underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="font-semibold text-[#1B3A6B] underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errorFor("acceptedTerms") && (
          <p className="mt-1.5 text-sm text-red-600">{errorFor("acceptedTerms")}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-70 disabled:cursor-not-allowed text-white text-base font-bold px-6 py-4 transition-colors shadow-lg shadow-teal-700/20"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            Creating your account...
          </>
        ) : (
          <>
            Create Account &amp; Continue
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </>
        )}
      </button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-[#1B3A6B] hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}
