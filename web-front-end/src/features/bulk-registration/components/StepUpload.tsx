'use client';
import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  ArrowLeft, ArrowRight, CalendarDays, Check, CheckCircle2, Download,
  FileSpreadsheet, Info, Loader2, RefreshCw, UploadCloud, X,
} from 'lucide-react';
import type { RegType } from '../types';
import { REG_COPY, TEMPLATE_FILE } from '../utils/constants';

interface Props {
  type: RegType;
  file: File | null;
  fileError: string | null;
  academicYear: string;
  loading: boolean;
  canValidate: boolean;
  onYear: (v: string) => void;
  onFile: (f: File | null) => void;
  onBack: () => void;
  onNext: () => void;
}

// Extra example rows so the preview looks like a real sheet.
const EXTRA_ROWS: Partial<Record<RegType, string[][]>> = {
  class: [['5', 'B'], ['7', 'A']],
};

const RULES: Record<RegType, string[]> = {
  class: ['Grade 1–13', 'Class: letters or digits, e.g. A', 'Existing classes are skipped'],
  teacher: ['Unique email per teacher', 'Grade and Class: both or neither', 'Up to 500 rows'],
  student: ['Admission number required', 'Grade and class must exist', 'Up to 500 rows'],
};

function TimelineItem({
  n, done, title, last, children,
}: { n: number; done: boolean; title: string; last?: boolean; children?: ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold text-white transition-colors duration-300 ${
            done ? 'bg-[#00a896]' : 'bg-[#073b78]'
          }`}
        >
          {done ? <Check className="h-4 w-4" /> : n}
        </span>
        {!last && <span className="mt-1 w-px flex-1 bg-[#e2e6ee]" />}
      </div>
      <div className={`min-w-0 flex-1 ${last ? '' : 'pb-6'}`}>
        <h3 className="text-sm font-bold leading-8 text-[#073b78]">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export function StepUpload({
  type, file, fileError, academicYear, loading, canValidate, onYear, onFile, onBack, onNext,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const copy = REG_COPY[type];
  const Icon = copy.icon;
  const { headers, example } = TEMPLATE_FILE[type];
  const rows = [example, ...(EXTRA_ROWS[type] ?? [])];
  const MAX_COLS = 4;
  const shownHeaders = headers.slice(0, MAX_COLS);
  const hiddenCount = headers.length - shownHeaders.length;
  const cols = {
    gridTemplateColumns: `repeat(${shownHeaders.length}, minmax(0, 1fr))${hiddenCount > 0 ? ' 3.5rem' : ''}`,
  };
  const title = type === 'class' ? 'Import classes' : `Upload your ${copy.label.toLowerCase()} file`;

  // Builds the template in the browser. The BOM and quoting make Excel read
  // UTF-8 names and commas correctly.
  const getTemplate = () => {
    const cell = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = '\uFEFF' + [headers, example].map((row) => row.map(cell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = copy.template;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
  };

  const openPicker = () => inputRef.current?.click();
  const clearFile = () => {
    onFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <>
      {/* Header card */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#e2e6ee] bg-gradient-to-r from-[#f1f6fc] to-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#073b78] text-white shadow-sm">
            <Icon className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-bold leading-tight text-[#073b78]">{title}</h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-600">{copy.uploadNote}</p>
          </div>
        </div>

        {type === 'class' && (
          <div className="shrink-0 rounded-xl bg-white px-5 py-2.5 text-center ring-1 ring-[#e2e6ee]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Academic year</p>
            <p className="mt-0.5 flex items-center justify-center gap-1.5 text-lg font-bold text-[#00796b]">
              <CalendarDays className="h-4 w-4" />
              {academicYear}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {/* Left: guided steps */}
        <section className="rounded-2xl border border-[#e2e6ee] bg-white p-6">
          <TimelineItem n={1} done={downloaded || !!file} title="Get the template">
            <button
              type="button"
              onClick={getTemplate}
              className="group mt-1 flex w-full items-center gap-3 rounded-xl border border-[#e2e6ee] bg-slate-50 p-3 text-left transition hover:border-[#073b78]/40 hover:bg-blue-50/50"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-[#073b78] shadow-sm">
                <FileSpreadsheet className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-slate-800">{copy.template}</span>
                <span className="block truncate text-xs text-slate-500">Columns: {copy.columns}</span>
              </span>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-[#073b78] ring-1 ring-[#e2e6ee] transition group-hover:bg-[#073b78] group-hover:text-white">
                <Download className="h-4 w-4" />
              </span>
            </button>
          </TimelineItem>

          <TimelineItem n={2} done={!!file} title="Fill it in">
  <p className="mb-3 text-sm text-slate-600">Keep the header row and add one row per entry.</p>

  {/* Spreadsheet-style preview: first columns only, no scrollbar */}
  <div className="overflow-hidden rounded-xl border border-[#e2e6ee] text-sm" title={`All columns: ${copy.columns}`}>
    <div style={cols} className="grid bg-slate-100 text-center text-[10px] font-semibold text-slate-400">
      {shownHeaders.map((_, i) => (
        <span key={i} className="border-r border-[#e2e6ee] py-1 last:border-r-0">
          {String.fromCharCode(65 + i)}
        </span>
      ))}
      {hiddenCount > 0 && <span className="py-1">…</span>}
    </div>
    <div style={cols} className="grid border-t border-[#e2e6ee] bg-slate-50 text-xs font-bold text-[#073b78]">
      {shownHeaders.map((h) => (
        <span key={h} className="truncate border-r border-[#e2e6ee] px-3 py-2">{h}</span>
      ))}
      {hiddenCount > 0 && (
        <span className="grid place-items-center bg-[#e6f6f4] px-1 py-2 text-[11px] font-semibold text-[#00796b]">
          +{hiddenCount}
        </span>
      )}
    </div>
    {rows.map((row, i) => (
      <div key={i} style={cols} className="grid border-t border-[#eef0f5] text-slate-700">
        {row.slice(0, MAX_COLS).map((cell, j) => (
          <span key={j} className="truncate border-r border-[#eef0f5] px-3 py-2">{cell || '\u00A0'}</span>
        ))}
        {hiddenCount > 0 && <span className="text-center text-slate-300 py-2">…</span>}
      </div>
    ))}
  </div>

  <div className="mt-3 flex flex-wrap gap-1.5">
    {RULES[type].map((r) => (
      <span key={r} className="rounded-full bg-[#e6f6f4] px-2.5 py-1 text-xs font-medium text-[#00796b]">{r}</span>
    ))}
  </div>
</TimelineItem>

          <TimelineItem n={3} done={!!file} title="Upload the finished file" last>
            <p className="text-sm text-slate-600">
              Drop it in the box <span className="hidden lg:inline">on the right</span>
              <span className="lg:hidden">below</span>. Nothing is saved until you confirm.
            </p>
          </TimelineItem>
        </section>

        {/* Right: upload area */}
        <section className="flex flex-col">
          {!file ? (
            <div
              role="button"
              tabIndex={0}
              aria-label="Choose a file to upload"
              onClick={openPicker}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openPicker()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); onFile(e.dataTransfer.files?.[0] ?? null); }}
              className={`group flex min-h-[340px] flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#073b78] ${
                dragging
                  ? 'scale-[1.01] border-[#00a896] bg-[#e6f6f4]/70'
                  : 'border-[#cfd8e6] bg-gradient-to-b from-slate-50 to-white hover:border-[#073b78]/50 hover:from-blue-50/60'
              }`}
            >
              <span
                className={`grid h-16 w-16 place-items-center rounded-full transition-all duration-200 ${
                  dragging
                    ? 'bg-[#00a896] text-white'
                    : 'bg-[#073b78]/10 text-[#073b78] group-hover:-translate-y-1 group-hover:bg-[#073b78] group-hover:text-white'
                }`}
              >
                <UploadCloud className="h-8 w-8" />
              </span>
              <p className="mt-5 text-base font-semibold text-slate-800">
                {dragging ? 'Release to upload' : 'Drag and drop your file here'}
              </p>
              <p className="mt-1 text-sm text-slate-500">or</p>
              <span className="mt-3 rounded-lg bg-[#073b78] px-5 py-2 text-sm font-semibold text-white transition group-hover:bg-[#0a56a8]">
                Browse files
              </span>
              <p className="mt-5 text-xs text-slate-400">.csv or .xlsx · up to 2 MB · 500 rows</p>
            </div>
          ) : (
            <div className="flex min-h-[340px] flex-1 flex-col items-center justify-center rounded-2xl border border-[#00a896]/30 bg-gradient-to-b from-[#e6f6f4]/70 to-white px-6 py-12 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-[#00a896] text-white shadow-sm">
                <CheckCircle2 className="h-8 w-8" />
              </span>
              <p className="mt-5 text-base font-semibold text-slate-800">File ready</p>

              <div className="mt-4 flex w-full max-w-sm items-center gap-3 rounded-xl border border-[#e2e6ee] bg-white p-3 text-left shadow-sm">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#e6f6f4] text-[#00796b]">
                  <FileSpreadsheet className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  aria-label="Remove file"
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={openPicker}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#073b78] hover:underline"
              >
                <RefreshCw className="h-3.5 w-3.5" />Choose a different file
              </button>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={(e) => { onFile(e.target.files?.[0] ?? null); e.target.value = ''; }}
          />
          {fileError && (
            <p role="alert" className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />{fileError}
            </p>
          )}
        </section>
      </div>

      {/* Academic year input: teachers and students only (classes get it from the landing page) */}
      {type !== 'class' && (
        <div className="mt-6 rounded-2xl border border-[#e2e6ee] p-5">
          <label htmlFor="academic-year" className="block text-sm font-semibold text-slate-700">
            Academic year{' '}
            {type === 'teacher' && (
              <span className="font-normal text-slate-400">(only needed if you assign class teachers)</span>
            )}
          </label>
          <input
            id="academic-year"
            value={academicYear}
            onChange={(e) => onYear(e.target.value)}
            placeholder="Same as your classes, e.g. 2026"
            className="mt-2 w-full max-w-xs rounded-lg border border-[#cfd4dd] bg-[#f7f9fa] px-3 py-2.5 text-sm placeholder:text-gray-400 focus:border-[#073b78] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#073b78]/15"
          />
          <p className="mt-1 text-xs text-slate-500">
            {type === 'student'
              ? "Required. It is used to find each student's class."
              : 'It is used to find the class of each class teacher.'}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#eef0f5] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />Back
        </button>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <span className="text-center text-sm text-slate-500 sm:text-right">
            {file ? 'Ready to validate' : 'Choose a file to continue'}
          </span>
          <button
            type="button"
            onClick={onNext}
            disabled={!canValidate || loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#073b78] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a56a8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#073b78] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Checking…</>
            ) : (
              <>Validate file<ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </div>
    </>
  );
}