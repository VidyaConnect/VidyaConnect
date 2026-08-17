"use client";

import { useState, useEffect } from "react";
import {
  ClipboardCheck,
  Search,
  Check,
  X,
  Clock,
  FileText,
  Upload,
  Download,
  AlertCircle,
} from "lucide-react";
import {
  markAttendance,
  getAttendanceByClass,
  submitAbsenceResponse,
  getAbsenceResponses,
} from "@/features/attendance/services/attendanceApi";
import type {
  AttendanceStatus,
  AttendanceRecord,
  AbsenceResponse,
} from "@/features/attendance/types/attendance.types";
import { getDownloadUrl } from "@/features/files/services/fileApi";
import FileUpload from "@/features/files/components/FileUpload";

const CLASS_ID = "class-8a";
const TODAY = new Date().toISOString().split("T")[0];

const STATUS_COLORS: Record<AttendanceStatus, string> = {
  PRESENT: "bg-green-100 text-green-800 border-green-200",
  ABSENT: "bg-red-100 text-red-800 border-red-200",
  LATE: "bg-yellow-100 text-yellow-800 border-yellow-200",
  EXEMPTED: "bg-blue-100 text-blue-800 border-blue-200",
  NOT_MARKED: "bg-gray-100 text-gray-500 border-gray-200",
};

const STATUS_ICONS: Record<AttendanceStatus, React.ReactNode> = {
  PRESENT: <Check className="w-4 h-4" />,
  ABSENT: <X className="w-4 h-4" />,
  LATE: <Clock className="w-4 h-4" />,
  EXEMPTED: <FileText className="w-4 h-4" />,
  NOT_MARKED: <AlertCircle className="w-4 h-4" />,
};

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [date, setDate] = useState(TODAY);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [showAbsenceForm, setShowAbsenceForm] = useState<string | null>(null);
  const [absenceReason, setAbsenceReason] = useState("");
  const [absenceFileId, setAbsenceFileId] = useState<string | null>(null);
  const [absenceFileName, setAbsenceFileName] = useState<string | null>(null);
  const [absenceSubmitting, setAbsenceSubmitting] = useState(false);

  const [absenceResponses, setAbsenceResponses] = useState<AbsenceResponse[]>([]);
  const [showAbsenceList, setShowAbsenceList] = useState(false);

  useEffect(() => {
    loadAttendance();
  }, [date]);

  async function loadAttendance() {
    setLoading(true);
    setMessage(null);
    try {
      const data = await getAttendanceByClass(CLASS_ID, date);
      setRecords(data.records);
    } catch {
      setRecords([]);
      setMessage("No records found for this date. Records will be created on first mark.");
    } finally {
      setLoading(false);
    }
  }

  function updateStatus(studentId: string, status: AttendanceStatus) {
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
    );
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const result = await markAttendance({
        classId: CLASS_ID,
        date,
        records: records.map((r) => ({
          studentId: r.studentId,
          studentName: r.studentName,
          rollNumber: r.rollNumber,
          status: r.status,
        })),
      });
      setMessage(`Attendance saved: ${result.markedCount} students marked`);
    } catch {
      setMessage("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  }

  async function handleAbsenceSubmit() {
    if (!absenceReason.trim()) return;
    setAbsenceSubmitting(true);
    try {
      const record = records.find((r) => r.studentId === showAbsenceForm);
      if (!record) return;

      await submitAbsenceResponse({
        attendanceRecordId: record.id,
        reason: absenceReason,
        fileId: absenceFileId || undefined,
        fileName: absenceFileName || undefined,
      });
      setMessage("Absence justification submitted");
      setShowAbsenceForm(null);
      setAbsenceReason("");
      setAbsenceFileId(null);
      setAbsenceFileName(null);
    } catch {
      setMessage("Failed to submit absence response");
    } finally {
      setAbsenceSubmitting(false);
    }
  }

  async function loadAbsenceResponses() {
    try {
      const responses = await getAbsenceResponses("student-001");
      setAbsenceResponses(responses);
      setShowAbsenceList(true);
    } catch {
      setMessage("Failed to load absence responses");
    }
  }

  async function handleDownload(fileId: string) {
    try {
      const data = await getDownloadUrl(fileId);
      window.open(data.downloadUrl, "_blank");
    } catch {
      setMessage("Failed to get download URL");
    }
  }

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center gap-3">
          <ClipboardCheck className="w-8 h-8 text-primary" />
          <div>
            <h1 className="font-display-lg text-2xl font-bold text-on-surface">
              Attendance Management
            </h1>
            <p className="text-sm text-on-surface-variant">
              Mark attendance and submit absence justifications
            </p>
          </div>
        </header>

        <div className="flex items-center gap-4 bg-surface-container-lowest rounded-xl p-4 border border-outline-variant">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-on-surface-variant" />
            <label className="text-sm font-semibold text-on-surface">Date:</label>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <button
            onClick={loadAbsenceResponses}
            className="ml-auto px-3 py-2 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
          >
            View Absence Submissions
          </button>
        </div>

        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm font-medium ${
            message.includes("Failed") ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"
          }`}>
            {message}
          </div>
        )}

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
          <div className="px-4 py-3 bg-surface-container-low border-b border-outline-variant">
            <h2 className="font-title-sm font-semibold text-on-surface">
              Class: {CLASS_ID} | Students: {records.length}
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-on-surface-variant">Loading...</div>
          ) : records.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant">
              No attendance records for this date.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase">
                    Roll
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase">
                    Student
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-on-surface-variant uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-on-surface-variant uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.studentId} className="border-b border-outline-variant/50 hover:bg-surface-container-low/50">
                    <td className="px-4 py-3 text-sm text-on-surface">{record.rollNumber}</td>
                    <td className="px-4 py-3 text-sm font-medium text-on-surface">{record.studentName}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-1">
                        {(["PRESENT", "ABSENT", "LATE", "EXEMPTED"] as AttendanceStatus[]).map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(record.studentId, s)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              record.status === s
                                ? STATUS_COLORS[s]
                                : "border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-low"
                            }`}
                            title={s}
                          >
                            {STATUS_ICONS[s]}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          setShowAbsenceForm(record.studentId);
                          setAbsenceReason("");
                          setAbsenceFileId(null);
                          setAbsenceFileName(null);
                        }}
                        className="text-xs text-primary font-semibold hover:underline"
                      >
                        Submit Absence Doc
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {records.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:brightness-110 disabled:opacity-50 transition-all shadow-md"
            >
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        )}

        {showAbsenceForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-surface-container-lowest rounded-xl p-6 w-full max-w-lg shadow-xl border border-outline-variant">
              <h3 className="font-title-sm font-bold text-on-surface mb-4">
                Submit Absence Justification
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-1">
                    Reason for absence
                  </label>
                  <textarea
                    value={absenceReason}
                    onChange={(e) => setAbsenceReason(e.target.value)}
                    rows={3}
                    placeholder="Enter reason for absence..."
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">
                    Supporting Document (optional)
                  </label>
                  <FileUpload
                    purpose="absence_document"
                    onUploadComplete={(fileId, fileName) => {
                      setAbsenceFileId(fileId);
                      setAbsenceFileName(fileName);
                    }}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  {absenceFileId && (
                    <p className="text-xs text-green-700 mt-2 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      File uploaded: {absenceFileName}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowAbsenceForm(null)}
                    className="px-4 py-2 text-sm font-semibold text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAbsenceSubmit}
                    disabled={!absenceReason.trim() || absenceSubmitting}
                    className="px-4 py-2 bg-primary text-on-primary text-sm font-semibold rounded-lg hover:brightness-110 disabled:opacity-50 transition-all"
                  >
                    {absenceSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAbsenceList && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-surface-container-lowest rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl border border-outline-variant">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-title-sm font-bold text-on-surface">
                  Absence Submissions
                </h3>
                <button
                  onClick={() => setShowAbsenceList(false)}
                  className="text-on-surface-variant hover:text-on-surface"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {absenceResponses.length === 0 ? (
                <p className="text-sm text-on-surface-variant text-center py-4">
                  No absence submissions found.
                </p>
              ) : (
                <div className="space-y-3">
                  {absenceResponses.map((resp) => (
                    <div
                      key={resp.id}
                      className="p-4 border border-outline-variant rounded-lg space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-on-surface">
                            Date: {resp.attendance.date}
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            Status: {resp.attendance.status}
                          </p>
                        </div>
                        <span className="text-xs text-on-surface-variant">
                          {new Date(resp.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-on-surface">{resp.reason}</p>
                      {resp.fileId && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <button
                            onClick={() => handleDownload(resp.fileId!)}
                            className="flex items-center gap-1 text-sm text-primary font-semibold hover:underline"
                          >
                            <Download className="w-3 h-3" />
                            {resp.fileName || "Download attachment"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
