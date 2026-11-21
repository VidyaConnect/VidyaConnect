"use client";

import axios from "axios";
import apiClient from "@/services/apiClient";
import {
  useState,
  useRef,
  useEffect,
  DragEvent,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  X,
  RefreshCw,
  Pencil,
  Check,
  ShieldCheck,
  Clock,
  Mail,
  Loader2,
  ChevronLeft,
  ChevronDown,
  AlertCircle,
  ArrowDown,
  PartyPopper,
  Send,
  Rocket,
} from "lucide-react";
import RegistrationHeader from "@/components/RegistrationHeader";
import { useRegistration } from "@/features/school-registration/hooks/useRegistration";
import type {
  ApiSuccessResponse,
  RegistrationSubmissionResponse,
} from "@/features/school-registration/types/school.types";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

type TaskId = 1 | 2 | 3;

/* ------------------------------------------------------------------ */
/* Inline-editable row (edits write straight to step 1 data)           */
/* ------------------------------------------------------------------ */

function EditableRow({
  label,
  value,
  placeholder,
  type = "text",
  inputMode,
  sanitize,
  validate,
  onSave,
}: {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  sanitize?: (v: string) => string;
  validate?: (v: string) => string;
  onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState(false);

  function start() {
    setDraft(value);
    setError("");
    setEditing(true);
  }

  function save() {
    const v = draft.trim();
    const err = !v ? "This can't be empty." : validate?.(v) ?? "";
    if (err) {
      setError(err);
      return;
    }
    onSave(v);
    setEditing(false);
    setFlash(true);
    setTimeout(() => setFlash(false), 1600);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    }
    if (e.key === "Escape") setEditing(false);
  }

  const missing = !value?.trim();

  if (editing) {
    return (
      <div className="rounded-xl border-2 border-teal-600 bg-white p-3 ring-4 ring-teal-600/10">
        <p className="mb-1.5 text-xs font-medium text-slate-500">{label}</p>
        <div className="flex gap-2">
          <input
            autoFocus
            type={type}
            inputMode={inputMode}
            value={draft}
            placeholder={placeholder}
            onChange={(e) => {
              setDraft(sanitize ? sanitize(e.target.value) : e.target.value);
              setError("");
            }}
            onKeyDown={onKeyDown}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[15px] text-slate-900 focus:border-teal-600 focus:bg-white focus:outline-none"
          />
          <button
            type="button"
            onClick={save}
            className="inline-flex items-center gap-1 rounded-lg bg-teal-700 px-3 text-sm font-medium text-white transition hover:bg-teal-800"
          >
            <Check className="h-4 w-4" />
            Save
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            aria-label="Cancel editing"
            className="rounded-lg border border-slate-200 px-2.5 text-slate-500 transition hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
        <p className="mt-1.5 text-xs text-slate-400">Press Enter to save, Esc to cancel.</p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={start}
      className={`group flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition ${
        flash
          ? "border-teal-500 bg-teal-50"
          : missing
          ? "border-rose-200 bg-rose-50/60 hover:border-rose-300"
          : "border-slate-200 bg-white hover:border-teal-500 hover:bg-teal-50/40"
      }`}
    >
      <span className="min-w-0">
        <span className="block text-xs text-slate-500">{label}</span>
        <span
          className={`block truncate text-[15px] font-medium ${
            missing ? "text-rose-600" : "text-slate-900"
          }`}
        >
          {missing ? "Missing. Tap to add" : value}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-slate-400 transition group-hover:text-teal-700">
        {flash ? (
          <>
            <Check className="h-4 w-4 text-teal-600" />
            <span className="text-teal-700">Saved</span>
          </>
        ) : (
          <>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </>
        )}
      </span>
    </button>
  );
}

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  const missing = !value?.trim();
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <span className="block text-xs text-slate-500">{label}</span>
      <span
        className={`block text-[15px] font-medium ${
          missing ? "text-rose-600" : "text-slate-900"
        }`}
      >
        {missing ? "Missing" : value}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Task shell (accordion item)                                         */
/* ------------------------------------------------------------------ */

function Task({
  id,
  index,
  title,
  summary,
  done,
  open,
  shake,
  onToggle,
  children,
}: {
  id: string;
  index: number;
  title: string;
  summary: string;
  done: boolean;
  open: boolean;
  shake: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm transition-colors ${
        open ? "border-teal-600/40 shadow-md" : "border-slate-200"
      } ${shake ? "task-shake" : ""}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        className="flex w-full items-center gap-4 p-5 text-left sm:p-6"
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
            done
              ? "scale-110 bg-teal-600 text-white"
              : open
              ? "bg-[#14305C] text-white"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {done ? <Check className="h-5 w-5" /> : index}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-semibold text-[#14305C]">{title}</span>
          <span
            className={`block truncate text-sm ${
              done ? "text-teal-700" : "text-slate-500"
            }`}
          >
            {summary}
          </span>
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        id={`${id}-panel`}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden" inert={!open} aria-hidden={!open}>
          <div className="border-t border-slate-100 p-5 pt-6 sm:p-6 sm:pt-6">{children}</div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Progress ring                                                       */
/* ------------------------------------------------------------------ */

function ProgressRing({ value, total }: { value: number; total: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (value / total) * c;
  return (
    <div className="relative h-[88px] w-[88px] shrink-0">
      <svg viewBox="0 0 88 88" className="h-full w-full -rotate-90">
        <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke="#FCD34D"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {value === total ? (
          <PartyPopper className="h-7 w-7 text-amber-300" />
        ) : (
          <>
            <span className="text-xl font-bold leading-none">{value}</span>
            <span className="text-[11px] text-white/60">of {total}</span>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Recap chip (clickable summary on the confirm card)                  */
/* ------------------------------------------------------------------ */

function RecapChip({
  ok,
  label,
  value,
  onClick,
}: {
  ok: boolean;
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group rounded-xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
        ok ? "border-teal-200 bg-teal-50/60" : "border-amber-200 bg-amber-50"
      }`}
    >
      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        {ok ? (
          <Check className="h-3.5 w-3.5 text-teal-600" />
        ) : (
          <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
        )}
        {label}
      </span>
      <span className="mt-1 block truncate text-sm font-semibold text-slate-900">{value}</span>
      <span className="mt-0.5 block text-xs text-slate-400 transition group-hover:text-teal-700">
        {ok ? "Tap to review" : "Tap to fix"}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* "What happens next" interactive timeline                            */
/* ------------------------------------------------------------------ */

function NextStepsTimeline({ email }: { email: string }) {
  const [active, setActive] = useState(1);

  const steps = [
    {
      icon: Send,
      title: "You submit",
      tag: "Today",
      text: "Your application and document are sent to our team.",
    },
    {
      icon: Clock,
      title: "Document review",
      tag: "24 to 48 business hours",
      text: "Our team reviews your verification document.",
    },
    {
      icon: Mail,
      title: "Decision email",
      tag: "After the review",
      text: `We email ${email || "your school email"} with the decision.`,
    },
    {
      icon: Rocket,
      title: "Portal setup",
      tag: "Once approved",
      text: "Sign in and set up your school portal.",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="font-semibold text-[#14305C]">What happens next</h3>
      <p className="mb-5 text-xs text-slate-500">Tap a step to see the details.</p>

      <ol>
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === active;
          const isPast = i < active;
          const isLast = i === steps.length - 1;
          return (
            <li key={step.title}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-expanded={isActive}
                className="group flex w-full gap-4 text-left"
              >
                <span className="flex flex-col items-center">
                  <span
                    className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 ${
                      isActive
                        ? "scale-110 bg-[#14305C] text-white ring-4 ring-teal-600/20"
                        : isPast
                        ? "bg-teal-600 text-white"
                        : "bg-teal-50 text-teal-700 group-hover:bg-teal-100"
                    }`}
                  >
                    {isPast ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    {i === 0 && !isPast && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-400" />
                      </span>
                    )}
                  </span>
                  {!isLast && (
                    <span
                      className={`my-1 w-0.5 flex-1 rounded transition-colors duration-500 ${
                        isPast ? "bg-teal-500" : "bg-slate-200"
                      }`}
                    />
                  )}
                </span>

                <span className={`min-w-0 flex-1 ${isLast ? "" : "pb-5"}`}>
                  <span className="flex flex-wrap items-center gap-2 pt-2">
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        isActive ? "text-[#14305C]" : "text-slate-700"
                      }`}
                    >
                      {step.title}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors ${
                        isActive ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {step.tag}
                    </span>
                  </span>
                  <span
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <span className="overflow-hidden">
                      <span className="block pt-1.5 text-sm text-slate-600">{step.text}</span>
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function RegisterSchoolStep3Page() {
  const router = useRouter();
  const { data, updateStep1, updateStep3, setSubmissionResult } = useRegistration();
  const form = data.step3;
  const s1 = data.step1;

  const [openTask, setOpenTask] = useState<TaskId>(1);
  const [shakeTask, setShakeTask] = useState<TaskId | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const file = form.verificationDocument as File | null;
  const hasDoc = !!file;
  const confirmed = !!form.confirmAccuracy;

  /* ------------------------ derived completion ------------------------ */

  const requiredFields: [string, string][] = [
    ["School name", s1.schoolName],
    ["Census number", s1.censusNumber ?? ""],
    ["School type", s1.schoolType],
    ["Address", s1.address],
    ["Province", s1.region],
    ["District", s1.district],
    ["Principal", s1.principalName],
    ["Email", s1.officialEmail],
    ["Contact number", s1.contactNumber],
  ];
  const missing = requiredFields.filter(([, v]) => !String(v ?? "").trim());

  const task1Done = hasDoc;
  const task2Done = reviewed && missing.length === 0;
  const task3Done = confirmed;
  const doneCount = [task1Done, task2Done, task3Done].filter(Boolean).length;

  const nextIncomplete: TaskId | null = !task1Done ? 1 : !task2Done ? 2 : !task3Done ? 3 : null;

  /* --------------------------- image preview --------------------------- */

  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [file]);

  /* ------------------------------ helpers ------------------------------ */

  function goTo(task: TaskId, shake = false) {
    setOpenTask(task);
    setTimeout(() => {
      document
        .getElementById(`task-${task}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    if (shake) {
      setShakeTask(task);
      setTimeout(() => setShakeTask(null), 600);
    }
  }

  /* ------------------------------- files ------------------------------- */

  function validateAndSetFile(f: File) {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setFileError("Only PDF, JPG, or PNG files are accepted.");
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      setFileError("File must be under 10MB.");
      return;
    }
    setFileError("");
    updateStep3({ verificationDocument: f });
  }

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) validateAndSetFile(f);
    e.target.value = "";
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) validateAndSetFile(f);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function removeFile() {
    updateStep3({ verificationDocument: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  /* ------------------------------ actions ------------------------------ */

  function handleBack() {
    router.push("/register-school/step-1");
  }

  async function handleSubmit() {
    setSubmitError("");

    // Smart submit: jump to the first thing that is still missing
    if (nextIncomplete) {
      setSubmitted(true);
      goTo(nextIncomplete, true);
      return;
    }

        setIsSubmitting(true);
    try {
      const payload = new FormData();

      // School details (step 1). The admin details are taken from the
      // logged-in account on the server, so we do not send them.
      payload.append("name", s1.schoolName);
      payload.append("censusNumber", s1.censusNumber ?? "");
      payload.append("email", s1.officialEmail);
      payload.append("phone", s1.contactNumber);
      payload.append("schoolType", s1.schoolType);
      payload.append("principalName", s1.principalName);
      payload.append("region", s1.region);
      payload.append("district", s1.district);
      payload.append("studentCount", String(s1.studentCount));
      payload.append("teacherCount", String(s1.teacherCount));
      payload.append("address", s1.address ?? "");

      // Verification file
      payload.append("verificationDoc", file as File);

      // apiClient sends the login token with the request
      const response = await apiClient.post<
        ApiSuccessResponse<RegistrationSubmissionResponse>
      >("/schools/register", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmissionResult(response.data.data);
      router.push("/register-school/success");
    } catch (err) {
      console.error("Registration submission error:", err);
      setSubmitError(
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Something went wrong submitting your registration. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ------------------------- summary strings ------------------------- */

  const location = [s1.district, s1.region && `${s1.region} Province`]
    .filter(Boolean)
    .join(", ");

  const task1Summary = hasDoc
    ? `${file!.name} (${(file!.size / (1024 * 1024)).toFixed(2)} MB)`
    : "Not uploaded yet";
  const task2Summary = task2Done
    ? "Reviewed"
    : missing.length
    ? `${missing.length} detail${missing.length > 1 ? "s" : ""} missing`
    : "Check your details";
  const task3Summary = task3Done ? "Confirmed" : "Waiting for your OK";

  const sizeRatio = file ? Math.min(100, (file.size / MAX_FILE_SIZE) * 100) : 0;
  const fileKind = file
    ? file.type === "application/pdf"
      ? "PDF"
      : file.type.includes("png")
      ? "PNG"
      : "JPG"
    : "";

  const taskLabels: { id: TaskId; label: string; short: string; done: boolean }[] = [
    { id: 1, label: "Upload your document", short: "Upload", done: task1Done },
    { id: 2, label: "Review your details", short: "Review", done: task2Done },
    { id: 3, label: "Confirm and send", short: "Confirm", done: task3Done },
  ];

  /* ------------------------------ render ------------------------------ */

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF3F8] to-white">
      <style>{`
        @keyframes task-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .task-shake { animation: task-shake 0.5s ease-in-out; }
        @media (prefers-reduced-motion: reduce) {
          .task-shake { animation: none; }
        }
      `}</style>

      <RegistrationHeader currentStep={2} />

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8">
        {/* Intro */}
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-[#14305C] sm:text-4xl">
            Almost done. Three quick things.
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Open each card, finish it, and send your application. You can fix any detail
            right here without going back.
          </p>
        </div>

        {/* Mobile stepper (the side card does this job on desktop) */}
        <nav aria-label="Progress" className="mb-8 flex items-center lg:hidden">
          {taskLabels.map((t, i) => (
            <div
              key={t.id}
              className={`flex items-center ${i < taskLabels.length - 1 ? "flex-1" : ""}`}
            >
              <button
                type="button"
                onClick={() => goTo(t.id)}
                className="flex items-center gap-2"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    t.done
                      ? "bg-teal-600 text-white"
                      : openTask === t.id
                      ? "bg-[#14305C] text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {t.done ? <Check className="h-4 w-4" /> : t.id}
                </span>
                <span
                  className={`text-sm font-medium ${
                    openTask === t.id ? "text-[#14305C]" : "text-slate-500"
                  }`}
                >
                  {t.short}
                </span>
              </button>
              {i < taskLabels.length - 1 && (
                <span
                  className={`mx-3 h-0.5 flex-1 rounded transition-colors ${
                    t.done ? "bg-teal-500" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* ------------------------- TASKS ------------------------- */}
          <div className="space-y-4">
            {/* TASK 1: upload */}
            <Task
              id="task-1"
              index={1}
              title="Upload your verification document"
              summary={task1Summary}
              done={task1Done}
              open={openTask === 1}
              shake={shakeTask === 1}
              onToggle={() => setOpenTask(openTask === 1 ? (nextIncomplete ?? 1) : 1)}
            >
              <p className="mb-4 text-sm text-slate-600">
                A government-issued licence or school accreditation certificate. We use it
                to confirm your school is real.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {!hasDoc ? (
                <div
                  role="button"
                  tabIndex={0}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  className={`cursor-pointer rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-teal-600/20 ${
                    isDragging
                      ? "scale-[1.02] border-teal-600 bg-teal-50"
                      : "border-slate-300 bg-slate-50/60 hover:border-teal-500 hover:bg-teal-50/50"
                  }`}
                >
                  <div
                    className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-200 ${
                      isDragging
                        ? "-translate-y-1 bg-teal-600 text-white"
                        : "bg-teal-100 text-teal-700"
                    }`}
                  >
                    <UploadCloud className="h-8 w-8" />
                  </div>
                  <p className="text-base font-semibold text-slate-900">
                    {isDragging ? "Let go to upload" : "Drop your file here"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    or{" "}
                    <span className="font-medium text-teal-700 underline">
                      choose from your device
                    </span>
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-slate-500">
                    {["PDF", "JPG", "PNG", "Up to 10 MB"].map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border-2 border-teal-600 bg-teal-50/60">
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    {/* Preview */}
                    <div className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm sm:w-36">
                      {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewUrl}
                          alt="Preview of your uploaded document"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-teal-700">
                          <FileText className="mx-auto h-10 w-10" />
                          <span className="mt-1 block text-xs font-semibold">PDF</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {file!.name}
                      </p>

                      <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                        <li className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-teal-600" />
                          Format accepted ({fileKind})
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-teal-600" />
                          {(file!.size / (1024 * 1024)).toFixed(2)} MB of 10 MB used
                        </li>
                      </ul>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-teal-100">
                        <div
                          className="h-full rounded-full bg-teal-600 transition-all duration-500"
                          style={{ width: `${Math.max(sizeRatio, 3)}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 sm:flex-col">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-rose-300 hover:text-rose-600"
                      >
                        <X className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {fileError && (
                <p className="mt-3 flex items-center gap-1.5 text-sm text-rose-600">
                  <AlertCircle className="h-4 w-4" /> {fileError}
                </p>
              )}
              {submitted && !hasDoc && !fileError && (
                <p className="mt-3 flex items-center gap-1.5 text-sm text-rose-600">
                  <AlertCircle className="h-4 w-4" /> Please upload a document to continue.
                </p>
              )}

              {hasDoc && (
                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => goTo(2)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#14305C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F2A54]"
                  >
                    Next: review details
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              )}
            </Task>

            {/* TASK 2: review */}
            <Task
              id="task-2"
              index={2}
              title="Review your details"
              summary={task2Summary}
              done={task2Done}
              open={openTask === 2}
              shake={shakeTask === 2}
              onToggle={() => setOpenTask(openTask === 2 ? (nextIncomplete ?? 2) : 2)}
            >
              <p className="mb-4 text-sm text-slate-600">
                Tap any row to fix it on the spot. Changes are saved straight away.
              </p>

              {missing.length > 0 && (
                <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Still missing: {missing.map(([name]) => name).join(", ")}.
                  </span>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <EditableRow
                    label="School name"
                    value={s1.schoolName}
                    onSave={(v) => updateStep1({ schoolName: v })}
                  />
                </div>
                <EditableRow
                  label="Census number"
                  value={s1.censusNumber ?? ""}
                  inputMode="numeric"
                  sanitize={(v) => v.replace(/\D/g, "")}
                  onSave={(v) => updateStep1({ censusNumber: v })}
                />
                <ReadOnlyRow label="School type" value={s1.schoolType} />
                <div className="sm:col-span-2">
                  <EditableRow
                    label="Address"
                    value={s1.address}
                    onSave={(v) => updateStep1({ address: v })}
                  />
                </div>
                <EditableRow
                  label="Principal"
                  value={s1.principalName}
                  onSave={(v) => updateStep1({ principalName: v })}
                />
                <EditableRow
                  label="Contact number"
                  value={s1.contactNumber}
                  type="tel"
                  inputMode="tel"
                  validate={(v) =>
                    v.replace(/\D/g, "").length < 9 ? "Enter a valid phone number." : ""
                  }
                  onSave={(v) => updateStep1({ contactNumber: v })}
                />
                <div className="sm:col-span-2">
                  <EditableRow
                    label="Official email"
                    value={s1.officialEmail}
                    type="email"
                    inputMode="email"
                    validate={(v) =>
                      /^\S+@\S+\.\S+$/.test(v) ? "" : "Enter a valid email address."
                    }
                    onSave={(v) => updateStep1({ officialEmail: v })}
                  />
                </div>
                <ReadOnlyRow label="Location" value={location} />
                <ReadOnlyRow
                  label="Students and teachers"
                  value={`${s1.studentCount || "0"} students, ${s1.teacherCount || "0"} teachers`}
                />
              </div>

              <p className="mt-3 text-xs text-slate-500">
                School type, location and counts are set in step 1.{" "}
                <button
                  type="button"
                  onClick={handleBack}
                  className="font-medium text-teal-700 underline"
                >
                  Go to step 1
                </button>
              </p>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  disabled={missing.length > 0}
                  onClick={() => {
                    setReviewed(true);
                    goTo(3);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#14305C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F2A54] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {task2Done ? "Next: confirm" : "Looks good"}
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            </Task>

            {/* TASK 3: confirm */}
            <Task
              id="task-3"
              index={3}
              title="Confirm and send"
              summary={task3Summary}
              done={task3Done}
              open={openTask === 3}
              shake={shakeTask === 3}
              onToggle={() => setOpenTask(openTask === 3 ? (nextIncomplete ?? 3) : 3)}
            >
              <p className="mb-4 text-sm text-slate-600">
                One last look. Tap a card to jump back and change anything.
              </p>

              <div className="mb-5 grid gap-3 sm:grid-cols-3">
                <RecapChip
                  ok={hasDoc}
                  label="Document"
                  value={hasDoc ? file!.name : "Not added yet"}
                  onClick={() => goTo(1)}
                />
                <RecapChip
                  ok={task2Done}
                  label="Details"
                  value={
                    task2Done
                      ? "Reviewed"
                      : missing.length
                      ? `${missing.length} missing`
                      : "Not reviewed yet"
                  }
                  onClick={() => goTo(2)}
                />
                <RecapChip
                  ok={!!s1.schoolName?.trim()}
                  label="School"
                  value={s1.schoolName || "Name missing"}
                  onClick={() => goTo(2)}
                />
              </div>

              <label
                className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-5 transition focus-within:ring-4 focus-within:ring-teal-600/20 ${
                  confirmed
                    ? "border-teal-600 bg-teal-50"
                    : submitted
                    ? "border-rose-300 bg-rose-50/50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => updateStep3({ confirmAccuracy: e.target.checked })}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                    confirmed ? "bg-teal-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      confirmed ? "left-6" : "left-1"
                    }`}
                  />
                </span>
                <span className="text-sm leading-relaxed text-slate-700">
                  I confirm that all the information is accurate and that I am authorized to
                  register{" "}
                  <strong className="text-slate-900">
                    {s1.schoolName || "this institution"}
                  </strong>
                  .
                </span>
              </label>

              {confirmed && (
                <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-teal-700">
                  <PartyPopper className="h-4 w-4" /> Thanks for confirming.
                </p>
              )}
              {submitted && !confirmed && (
                <p className="mt-3 flex items-center gap-1.5 text-sm text-rose-600">
                  <AlertCircle className="h-4 w-4" /> Please switch this on to continue.
                </p>
              )}
            </Task>

            {submitError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2">
              <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-4 focus:ring-teal-600/30 disabled:opacity-60 ${
                    nextIncomplete
                      ? "bg-slate-500 hover:bg-slate-600"
                      : "bg-teal-700 hover:bg-teal-800"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting
                    </>
                  ) : nextIncomplete ? (
                    `Finish step ${nextIncomplete} to submit`
                  ) : (
                    "Submit registration"
                  )}
                </button>
              </div>
              {nextIncomplete && (
                <p className="mt-2 text-right text-xs text-slate-500">
                  Tap the button and we&apos;ll take you to what&apos;s left.
                </p>
              )}
            </div>
          </div>

          {/* ------------------------- ASIDE ------------------------- */}
          <aside className="space-y-4 lg:sticky lg:top-6">
            <div className="relative overflow-hidden rounded-2xl bg-[#14305C] p-6 text-white shadow-xl shadow-[#14305C]/20">
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-teal-500/20" />
              <div className="absolute -right-2 top-14 h-16 w-16 rounded-full bg-amber-300/20" />

              <div className="relative flex items-center gap-4">
                <ProgressRing value={doneCount} total={3} />
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold leading-tight">
                    {s1.schoolName || "Your school"}
                  </h3>
                  <p className="truncate text-sm text-white/70">
                    {[s1.schoolType, location].filter(Boolean).join(" · ") || "Registration"}
                  </p>
                  <p className="mt-1 text-xs font-medium text-amber-300">
                    {doneCount === 3 ? "All set. Ready to send." : `${3 - doneCount} to go`}
                  </p>
                </div>
              </div>

              <ul className="relative mt-5 space-y-1">
                {taskLabels.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => goTo(t.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        openTask === t.id ? "bg-white/15" : "hover:bg-white/10"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                          t.done
                            ? "bg-amber-300 text-[#14305C]"
                            : "border border-white/30 text-white/70"
                        }`}
                      >
                        {t.done ? <Check className="h-3.5 w-3.5" /> : t.id}
                      </span>
                      <span className={t.done ? "text-white" : "text-white/70"}>{t.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <NextStepsTimeline email={s1.officialEmail} />

            <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <ShieldCheck className="h-5 w-5 shrink-0 text-teal-600" />
              <p className="text-sm text-slate-600">
                Your documents and personal details are encrypted and only used to verify
                your school.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}