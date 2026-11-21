"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Landmark,
  Building2,
  Sparkles,
  Globe,
  MapPin,
  Mail,
  Phone,
  User,
  Users,
  Minus,
  Plus,
  Check,
  Save,
  LifeBuoy,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import RegistrationHeader from "@/components/RegistrationHeader";
import { useRegistration } from "@/features/school-registration/hooks/useRegistration";
import type { SchoolCategory } from "@/features/school-registration/types/school.types";
import { DISTRICTS_BY_PROVINCE } from "@/features/school-registration/types/school.types";

/* ------------------------------------------------------------------ */
/* Static options (same values as before, so the backend is untouched) */
/* ------------------------------------------------------------------ */

const SCHOOL_TYPES: {
  value: SchoolCategory;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "Government", hint: "Run by the state", icon: Landmark },
  { value: "Semi-Government", hint: "State-assisted", icon: Building2 },
  { value: "Private", hint: "Independently run", icon: Sparkles },
  { value: "International", hint: "Foreign curriculum", icon: Globe },
];

const PROVINCES = [
  "Western",
  "Central",
  "Southern",
  "Northern",
  "Eastern",
  "North Western",
  "North Central",
  "Uva",
  "Sabaragamuwa",
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 transition focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-600/15";

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function Field({
  label,
  hint,
  icon: Icon,
  children,
}: {
  label: string;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-800">
        {Icon && <Icon className="h-4 w-4 text-slate-400" />}
        {label}
        <span className="text-rose-500" aria-hidden>
          *
        </span>
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-[#14305C]">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function CountStepper({
  label,
  icon,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (v: string) => void;
  step?: number;
}) {
  const n = parseInt(value || "0", 10) || 0;
  return (
    <Field label={label} icon={icon}>
      <div className="flex items-stretch overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 transition focus-within:border-teal-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-600/15">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(String(Math.max(0, n - step)))}
          className="px-4 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <Minus className="h-4 w-4" />
        </button>
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          required
          className="w-full bg-transparent py-3 text-center text-[15px] font-semibold text-slate-900 placeholder-slate-400 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(String(n + step))}
          className="px-4 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </Field>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function RegisterSchoolStep1Page() {
  const router = useRouter();
  const { data, updateStep1 } = useRegistration();
  const form = data.step1;
  const [draftSaved, setDraftSaved] = useState(false);

  const availableDistricts = form.region ? DISTRICTS_BY_PROVINCE[form.region] ?? [] : [];

  // Progress: how many of the required fields are filled
  const requiredValues = [
    form.schoolName,
    form.censusNumber,
    form.address,
    form.schoolType,
    form.officialEmail,
    form.principalName,
    form.contactNumber,
    form.region,
    form.district,
    form.studentCount,
    form.teacherCount,
  ];
  const filled = requiredValues.filter((v) => String(v ?? "").trim() !== "").length;
  const percent = Math.round((filled / requiredValues.length) * 100);

  const activeType = SCHOOL_TYPES.find((t) => t.value === form.schoolType);
  const TypeIcon = activeType?.icon ?? GraduationCap;

  function handleSaveDraft() {
    console.log("Draft saved locally:", data);
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2500);
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    router.push("/register-school/step-2");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF3F8] to-white">
      <RegistrationHeader currentStep={1} />

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8">
        {/* Intro */}
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-[#14305C] sm:text-4xl">
            Let&apos;s get your school on VidyaConnect
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Tell us about your school. It takes about three minutes, and you can save a
            draft and come back any time.
          </p>

          {/* Mobile progress */}
          <div className="mt-5 lg:hidden">
            <div className="mb-1 flex justify-between text-xs font-medium text-slate-500">
              <span>{filled} of {requiredValues.length} answered</span>
              <span>{percent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-teal-600 transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* ------------------------- FORM ------------------------- */}
          <form onSubmit={handleNext} className="space-y-6">
            {/* About */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <SectionTitle
                icon={GraduationCap}
                title="About your school"
                subtitle="The name and kind of school you run."
              />

              <div className="space-y-5">
                <Field label="School name">
                  <input
                    type="text"
                    value={form.schoolName}
                    onChange={(e) => updateStep1({ schoolName: e.target.value })}
                    placeholder="e.g. Royal Academy International"
                    required
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="School census number"
                  hint="The number issued to your school by the Ministry of Education."
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.censusNumber ?? ""}
                    onChange={(e) =>
                      updateStep1({ censusNumber: e.target.value.replace(/\D/g, "") })
                    }
                    placeholder="e.g. 01234"
                    required
                    className={inputClass}
                  />
                </Field>

                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-slate-800">
                    School type <span className="text-rose-500">*</span>
                  </legend>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {SCHOOL_TYPES.map(({ value, hint, icon: Icon }) => {
                      const selected = form.schoolType === value;
                      return (
                        <label
                          key={value}
                          className={`relative cursor-pointer rounded-xl border-2 p-3.5 transition focus-within:ring-4 focus-within:ring-teal-600/20 ${
                            selected
                              ? "border-teal-600 bg-teal-50"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="schoolType"
                            value={value}
                            checked={selected}
                            required
                            onChange={() => updateStep1({ schoolType: value })}
                            className="sr-only"
                          />
                          {selected && (
                            <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-white">
                              <Check className="h-3 w-3" />
                            </span>
                          )}
                          <Icon
                            className={`mb-2 h-6 w-6 ${
                              selected ? "text-teal-700" : "text-slate-400"
                            }`}
                          />
                          <span className="block text-sm font-semibold text-slate-900">
                            {value}
                          </span>
                          <span className="block text-xs text-slate-500">{hint}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </div>
            </section>

            {/* Contact */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <SectionTitle
                icon={User}
                title="Who we can reach"
                subtitle="We use these details to verify your school."
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Principal name" icon={User}>
                  <input
                    type="text"
                    value={form.principalName}
                    onChange={(e) => updateStep1({ principalName: e.target.value })}
                    placeholder="Full name"
                    required
                    className={inputClass}
                  />
                </Field>
                <Field label="Contact number" icon={Phone}>
                  <input
                    type="tel"
                    value={form.contactNumber}
                    onChange={(e) => updateStep1({ contactNumber: e.target.value })}
                    placeholder="+94 XX XXX XXXX"
                    required
                    className={inputClass}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field
                    label="Official school email"
                    icon={Mail}
                    hint="Use the address your school office checks regularly."
                  >
                    <input
                      type="email"
                      value={form.officialEmail}
                      onChange={(e) => updateStep1({ officialEmail: e.target.value })}
                      placeholder="admin@school.edu"
                      required
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            </section>

            {/* Location */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <SectionTitle
                icon={MapPin}
                title="Where you are"
                subtitle="Pick your province, then your district."
              />

              <div className="space-y-5">
                <Field label="School address" icon={MapPin}>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => updateStep1({ address: e.target.value })}
                    placeholder="e.g. 123 Galle Road, Colombo 03"
                    required
                    className={inputClass}
                  />
                </Field>

                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-slate-800">
                    Province <span className="text-rose-500">*</span>
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {PROVINCES.map((p) => {
                      const selected = form.region === p;
                      return (
                        <label
                          key={p}
                          className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition focus-within:ring-4 focus-within:ring-teal-600/20 ${
                            selected
                              ? "border-teal-600 bg-teal-600 text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="region"
                            value={p}
                            checked={selected}
                            required
                            onChange={() => updateStep1({ region: p, district: "" })}
                            className="sr-only"
                          />
                          {p}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <Field label="District">
                  <select
                    value={form.district}
                    onChange={(e) => updateStep1({ district: e.target.value })}
                    required
                    disabled={!form.region}
                    className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400`}
                  >
                    <option value="">
                      {form.region ? "Choose your district" : "Choose a province first"}
                    </option>
                    {availableDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </section>

            {/* Size */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <SectionTitle
                icon={Users}
                title="How big is your school"
                subtitle="Rough numbers are fine. You can update them later."
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <CountStepper
                  label="Students"
                  icon={GraduationCap}
                  value={form.studentCount}
                  onChange={(v) => updateStep1({ studentCount: v })}
                  step={10}
                />
                <CountStepper
                  label="Teachers"
                  icon={Users}
                  value={form.teacherCount}
                  onChange={(v) => updateStep1({ teacherCount: v })}
                />
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {draftSaved ? (
                  <>
                    <Check className="h-4 w-4 text-teal-600" /> Draft saved
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save draft
                  </>
                )}
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-600/30"
              >
                Continue to review
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* ---------------------- LIVE PREVIEW ---------------------- */}
          <aside className="hidden lg:sticky lg:top-6 lg:block">
            {/* The school "nameplate" fills in as the form is completed */}
            <div className="overflow-hidden rounded-2xl bg-[#14305C] text-white shadow-xl shadow-[#14305C]/20">
              <div className="relative px-6 pb-6 pt-6">
                <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-teal-500/20" />
                <div className="absolute -right-2 top-14 h-16 w-16 rounded-full bg-amber-300/20" />

                <div className="relative flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                    <TypeIcon className="h-6 w-6 text-amber-300" />
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                    {form.schoolType || "School type"}
                  </span>
                </div>

                <h3
                  className={`relative mt-5 text-2xl font-bold leading-tight ${
                    form.schoolName ? "text-white" : "text-white/35"
                  }`}
                >
                  {form.schoolName || "Your school name"}
                </h3>
                {form.censusNumber && (
                  <p className="relative mt-1 text-xs text-white/60">
                    Census no. {form.censusNumber}
                  </p>
                )}
                <p className="relative mt-1 flex items-center gap-1.5 text-sm text-white/70">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {form.district || form.region
                    ? [form.district, form.region && `${form.region} Province`]
                        .filter(Boolean)
                        .join(", ")
                    : "Location"}
                </p>
              </div>

              <dl className="space-y-3 border-t border-white/10 bg-white/[0.04] px-6 py-5 text-sm">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 shrink-0 text-teal-300" />
                  <dd className={form.principalName ? "text-white" : "text-white/35"}>
                    {form.principalName || "Principal"}
                  </dd>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-teal-300" />
                  <dd
                    className={`truncate ${
                      form.officialEmail ? "text-white" : "text-white/35"
                    }`}
                  >
                    {form.officialEmail || "Official email"}
                  </dd>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-teal-300" />
                  <dd className={form.contactNumber ? "text-white" : "text-white/35"}>
                    {form.contactNumber || "Contact number"}
                  </dd>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-xl bg-white/10 px-4 py-3">
                    <div className="text-xl font-bold">{form.studentCount || "0"}</div>
                    <div className="text-xs text-white/60">Students</div>
                  </div>
                  <div className="rounded-xl bg-white/10 px-4 py-3">
                    <div className="text-xl font-bold">{form.teacherCount || "0"}</div>
                    <div className="text-xs text-white/60">Teachers</div>
                  </div>
                </div>
              </dl>

              <div className="px-6 pb-6 pt-1">
                <div className="mb-1.5 flex justify-between text-xs text-white/70">
                  <span>{filled} of {requiredValues.length} answered</span>
                  <span>{percent}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-amber-300 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <ShieldCheck className="h-5 w-5 shrink-0 text-teal-600" />
                <p className="text-sm text-slate-600">
                  Your details are kept secure and only used to verify your school.
                </p>
              </div>
              <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <LifeBuoy className="h-5 w-5 shrink-0 text-teal-600" />
                <p className="text-sm text-slate-600">
                  Stuck? Talk to our{" "}
                  <a href="#" className="font-medium text-teal-700 underline">
                    support team
                  </a>
                  .
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile-only footer notes */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:hidden">
          <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <ShieldCheck className="h-5 w-5 shrink-0 text-teal-600" />
            <p className="text-sm text-slate-600">
              Your details are kept secure and only used to verify your school.
            </p>
          </div>
          <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <LifeBuoy className="h-5 w-5 shrink-0 text-teal-600" />
            <p className="text-sm text-slate-600">
              Stuck? Talk to our{" "}
              <a href="#" className="font-medium text-teal-700 underline">
                support team
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}