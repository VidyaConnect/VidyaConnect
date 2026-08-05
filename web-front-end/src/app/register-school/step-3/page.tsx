"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  FileUp,
  ChevronDown,
  ShieldCheck,
  GraduationCap,
  UserCheck,
  FileText,
  X,
} from "lucide-react";
import RegistrationHeader from "@/components/RegistrationHeader";
import { useRegistration } from "@/features/school-registration/hooks/useRegistration";
import type {
  ApiSuccessResponse,
  RegistrationSubmissionResponse,
} from "@/features/school-registration/types/school.types";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

export default function RegisterSchoolStep3Page() {
  const router = useRouter();
  const { data, updateStep3, setSubmissionResult } = useRegistration();
  const form = data.step3;

  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [openSection, setOpenSection] = useState<"school" | "admin" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function validateAndSetFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError("Only PDF, JPG, or PNG files are accepted.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError("File must be under 10MB.");
      return;
    }
    setFileError("");
    updateStep3({ verificationDocument: file });
  }

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
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

  function toggleSection(section: "school" | "admin") {
    setOpenSection((prev) => (prev === section ? null : section));
  }

  function handleBack() {
    router.push("/register-school/step-2");
  }

  async function handleSubmit() {
    setSubmitted(true);
    setSubmitError("");

    if (!form.verificationDocument || !form.confirmAccuracy) {
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: replace with your actual submission endpoint.
      // Typically this posts step1 + step2 as JSON plus the file via FormData.
      const payload = new FormData();
      payload.append("schoolDetails", JSON.stringify(data.step1));
      payload.append("adminAccount", JSON.stringify(data.step2));
      payload.append("verificationDocument", form.verificationDocument);

      const res = await fetch("/api/school-registration", {
        method: "POST",
        body: payload,
      });

      if (!res.ok) throw new Error("Submission failed");

      const result: ApiSuccessResponse<RegistrationSubmissionResponse> = await res.json();
      setSubmissionResult(result.data);
      router.push("/register-school/success");
    } catch (err) {
      console.error("Registration submission error:", err);
      setSubmitError("Something went wrong submitting your registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <RegistrationHeader currentStep={3} />

      <div className="max-w-3xl mx-auto px-6 pt-12 pb-16">
        <h1 className="text-3xl font-bold text-[#1B3A6B] mb-2 text-center">Step 3 of 3</h1>
        <p className="text-slate-600 mb-8 text-center">
          Finalize your school registration and verify credentials.
        </p>

        {/* Upload section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
          <h2 className="font-bold text-[#1B3A6B] mb-1.5">Upload School Verification Document</h2>
          <p className="text-sm text-slate-600 mb-5">
            Please provide a government-issued license or school accreditation certificate
            (PDF, JPG, or PNG).
          </p>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg py-12 px-6 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-teal-500 bg-teal-50"
                : "border-slate-300 bg-slate-50 hover:bg-slate-100"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {form.verificationDocument ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center gap-3"
              >
                <FileText className="w-6 h-6 text-teal-600 shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-800">
                    {form.verificationDocument.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(form.verificationDocument.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="ml-2 text-slate-400 hover:text-red-500"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="w-11 h-11 mx-auto mb-3 rounded-lg bg-teal-100 flex items-center justify-center">
                  <FileUp className="w-5 h-5 text-teal-700" />
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-1">
                  Drag &amp; drop files here
                </p>
                <p className="text-sm text-slate-600">
                  or{" "}
                  <span className="text-teal-600 underline font-medium">browse files</span>{" "}
                  from your computer
                </p>
                <p className="text-xs text-slate-400 mt-3 tracking-wide uppercase">
                  Maximum file size: 10MB
                </p>
              </>
            )}
          </div>

          {fileError && <p className="text-xs text-red-500 mt-2">{fileError}</p>}
          {submitted && !form.verificationDocument && !fileError && (
            <p className="text-xs text-red-500 mt-2">
              Please upload a verification document.
            </p>
          )}
        </div>

        {/* Review summary */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-50 p-6 border-b border-slate-200">
            <h2 className="font-bold text-[#1B3A6B]">Review Summary</h2>
            <p className="text-sm text-slate-600">Verify the details entered in previous steps.</p>
          </div>

          <button
            type="button"
            onClick={() => toggleSection("school")}
            className="w-full flex items-center justify-between px-6 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
              <GraduationCap className="w-4 h-4 text-slate-500" />
              School Information
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform ${
                openSection === "school" ? "rotate-180" : ""
              }`}
            />
          </button>
          {openSection === "school" && (
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 text-sm text-slate-700 space-y-1.5">
              <p><span className="text-slate-500">School Name:</span> {data.step1.schoolName || "—"}</p>
              <p><span className="text-slate-500">Type:</span> {data.step1.schoolType || "—"}</p>
              <p><span className="text-slate-500">Email:</span> {data.step1.officialEmail || "—"}</p>
              <p><span className="text-slate-500">Principal:</span> {data.step1.principalName || "—"}</p>
              <p><span className="text-slate-500">Contact:</span> {data.step1.contactNumber || "—"}</p>
              <p><span className="text-slate-500">Location:</span> {data.step1.district || "—"}, {data.step1.region || "—"}</p>
              <p><span className="text-slate-500">Students / Teachers:</span> {data.step1.studentCount || "0"} / {data.step1.teacherCount || "0"}</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => toggleSection("admin")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
          >
            <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
              <UserCheck className="w-4 h-4 text-slate-500" />
              Administrator Account
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform ${
                openSection === "admin" ? "rotate-180" : ""
              }`}
            />
          </button>
          {openSection === "admin" && (
            <div className="px-6 py-4 bg-slate-50/50 text-sm text-slate-700 space-y-1.5">
              <p><span className="text-slate-500">Name:</span> {data.step2.adminFirstName} {data.step2.adminLastName}</p>
              <p><span className="text-slate-500">Email:</span> {data.step2.adminEmail || "—"}</p>
              <p><span className="text-slate-500">Phone:</span> {data.step2.adminPhone || "—"}</p>
              <p><span className="text-slate-500">Role:</span> School Administrator</p>
            </div>
          )}
        </div>

        {/* Encrypted notice */}
        <div className="bg-[#0F2A54] rounded-xl p-6 mb-6 flex gap-4">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <p className="text-teal-400 font-semibold text-sm mb-1">Encrypted &amp; Secure</p>
            <p className="text-sm text-slate-200 leading-relaxed">
              Your documents and personal information are protected by enterprise-grade
              encryption. Once submitted, our auditing team will review your application
              within 24-48 business hours.
            </p>
          </div>
        </div>

        {/* Confirm checkbox */}
        <label className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer mb-2">
          <input
            type="checkbox"
            checked={form.confirmAccuracy}
            onChange={(e) => updateStep3({ confirmAccuracy: e.target.checked })}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          <span>
            I confirm all information is accurate and that I am authorized to register this
            institution on behalf of{" "}
            <strong>{data.step1.schoolName || "this institution"}</strong>. I agree to the{" "}
            <a href="#" className="text-teal-600 underline font-medium">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-teal-600 underline font-medium">
              Privacy Policy
            </a>
            .
          </span>
        </label>
        {submitted && !form.confirmAccuracy && (
          <p className="text-xs text-red-500 mb-4">You must confirm this to submit.</p>
        )}
        {submitError && <p className="text-sm text-red-500 mb-4">{submitError}</p>}

        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            ‹ Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Submitting…" : "Submit Registration"}
          </button>
        </div>
      </div>
    </div>
  );
}