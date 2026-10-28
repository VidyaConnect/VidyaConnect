'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AnnouncementPriority,
  TargetAudience,
  CreateAnnouncementInput,
} from '../types/announcement';
import { createAnnouncement } from '../services/announcementService';
import { ROLE_CONFIG, type AnnouncementRole, type Template } from './roleConfig';
import FileField from '@/features/files/components/FileField';

const MAX_TITLE = 100;
const SOFT_TITLE = 60;
const MAX_CONTENT = 2000;

/* ---------- Priority look ---------- */
const PRIORITIES: {
  value: AnnouncementPriority;
  label: string;
  hint: string;
  bar: string;
  header: string;
  selected: string;
  iconWrap: string;
  badge: string;
}[] = [
  {
    value: 'normal',
    label: 'Normal',
    hint: 'General news and updates',
    bar: 'bg-[#073b78]',
    header: 'from-[#073b78] to-[#0a56a8]',
    selected: 'border-[#073b78] bg-[#073b78] text-white shadow-md',
    iconWrap: 'bg-blue-100 text-[#073b78]',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    value: 'urgent',
    label: 'Urgent',
    hint: 'Needs attention soon',
    bar: 'bg-amber-500',
    header: 'from-amber-500 to-amber-400',
    selected: 'border-amber-500 bg-amber-500 text-white shadow-md',
    iconWrap: 'bg-amber-100 text-amber-600',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    value: 'emergency',
    label: 'Emergency',
    hint: 'Immediate action required',
    bar: 'bg-red-600',
    header: 'from-red-600 to-red-500',
    selected: 'border-red-600 bg-red-600 text-white shadow-md',
    iconWrap: 'bg-red-100 text-red-600',
    badge: 'bg-red-100 text-red-700',
  },
];

/* ---------- Icons ---------- */
const ip = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};
const InfoIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" {...ip}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </svg>
);
const BellIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" {...ip}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
);
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" {...ip}>
    <path d="M12 9v4M12 17h.01" />
    <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" {...ip}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2 20a7 7 0 0 1 14 0" />
    <path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 20a6 6 0 0 0-4-5.6" />
  </svg>
);
const CheckIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} {...ip} strokeWidth={3}>
    <path d="M5 13l4 4L19 7" />
  </svg>
);

const BoltIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} {...ip}>
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
  </svg>
);
const BulbIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} {...ip}>
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
  </svg>
);
const SendIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} {...ip}>
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const PRIORITY_ICONS: Partial<Record<AnnouncementPriority, React.ReactNode>> = { normal: <InfoIcon />, urgent: <BellIcon />, emergency: <AlertIcon /> };

/* ---------- Section wrapper ---------- */
function Section({
  step,
  title,
  note,
  done,
  children,
}: {
  step: number;
  title: string;
  note?: string;
  done?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#e2e6ee] bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
            done ? 'bg-[#00a896] text-white' : 'bg-[#073b78]/10 text-[#073b78]'
          }`}
        >
          {done ? <CheckIcon className="h-3.5 w-3.5" /> : step}
        </span>
        <div>
          <h2 className="text-base font-bold text-[#0f172a]">{title}</h2>
          {note && <p className="text-xs text-[#64748b]">{note}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function AnnouncementForm({
  role = 'school-admin',
}: {
  role?: AnnouncementRole;
}) {
  // Everything that differs between roles lives in roleConfig.ts
  const config = ROLE_CONFIG[role];
  const { audiences, templates } = config;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<AnnouncementPriority>('normal');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>(audiences[0].value);
  const [requireReadConfirmation, setRequireReadConfirmation] = useState(false);
  const [attachment, setAttachment] = useState<{ id: string; name: string } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [published, setPublished] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false); // mobile only

  const activePriority = PRIORITIES.find((p) => p.value === priority) ?? PRIORITIES[0];
  const activeAudience = audiences.find((a) => a.value === targetAudience) ?? audiences[0];
  const canSubmit =
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    content.length <= MAX_CONTENT &&
    !isSubmitting;

  function resetForm() {
    setTitle('');
    setContent('');
    setPriority('normal');
    setTargetAudience(audiences[0].value);
    setRequireReadConfirmation(false);
    setAttachment(null);
    setErrorMessage('');
    setPublished(false);
  }

  function applyTemplate(t: Template) {
    setTitle(t.title);
    setContent(t.content);
    setPriority(t.priority);
    setErrorMessage('');
  }

  async function publish() {
    setConfirmOpen(false);
    setErrorMessage('');

    const input: CreateAnnouncementInput = {
      title: title.trim(),
      content: content.trim(),
      priority,
      targetAudience,
      requireReadConfirmation,
      attachmentId: attachment?.id,
    };

    setIsSubmitting(true);
    try {
      await createAnnouncement(input);
      setPublished(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to publish announcement.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setErrorMessage('Add a title before publishing.');
    if (!content.trim()) return setErrorMessage('Add a message before publishing.');

    // Extra safety step for emergencies
    if (priority === 'emergency') {
      setConfirmOpen(true);
      return;
    }
    publish();
  }

  /* ---------- Preview card (shared by desktop + mobile) ---------- */
  const preview = (
    <div className="overflow-hidden rounded-2xl border border-[#e2e6ee] bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-5 py-3">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#00a896]" />
        <span className="text-xs font-semibold text-[#64748b]">
          Live preview: how recipients will see it
        </span>
      </div>
      <div className="p-5">
        <div className="overflow-hidden rounded-xl border border-[#e2e6ee]">
          <div className={`bg-gradient-to-r ${activePriority.header} px-4 py-3 text-white`}>
            <span className="inline-block rounded-full bg-white/25 px-2.5 py-0.5 text-[11px] font-bold">
              {activePriority.label}
            </span>
            <h3 className="mt-2 break-words text-base font-bold leading-snug">
              {title.trim() || <span className="text-white/60">Your announcement title</span>}
            </h3>
          </div>
          <div className="p-4">
            <p className="line-clamp-6 whitespace-pre-line break-words text-sm text-gray-600">
              {content.trim() || (
                <span className="text-gray-300">Your message will appear here as you type...</span>
              )}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3 text-xs">
              <span className="rounded-full bg-[#e6f6f4] px-2.5 py-1 font-semibold text-[#007a6c]">
                To: {activeAudience.label}
              </span>
              {requireReadConfirmation && (
                <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-[#073b78]">
                  Read confirmation on
                </span>
              )}
              <span className="ml-auto text-gray-400">Just now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ---------- Form ---------- */
  return (
    <div className="w-full">
      {/* Page header */}
      <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#073b78] to-[#0a56a8] p-6 text-white shadow-sm">
        <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-12 right-24 h-32 w-32 rounded-full bg-[#00a896]/30" />
        <h1 className="relative text-2xl font-bold">Create announcement</h1>
        <p className="relative mt-1 text-sm text-white/75">{config.formSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:items-start">
        <form onSubmit={handleSubmit} className="space-y-5 lg:col-span-3">
          {/* Quick start */}
          <div className="rounded-2xl border border-[#e2e6ee] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00a896] text-white">
                <BoltIcon />
              </span>
              <div>
                <h2 className="text-base font-bold text-[#0f172a]">Start from a template</h2>
                <p className="text-xs text-[#64748b]">
                  Tap one to fill the form, then edit anything you like.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {templates.map((t) => {
                const tone = PRIORITIES.find((p) => p.value === t.priority) ?? PRIORITIES[0];
                return (
                  <button
                    type="button"
                    key={t.name}
                    onClick={() => applyTemplate(t)}
                    className="group relative overflow-hidden rounded-xl border border-[#e2e6ee] bg-[#f7f9fa] p-3 pl-4 text-left transition hover:border-[#00a896] hover:bg-white hover:shadow-md"
                  >
                    <span className={`absolute inset-y-0 left-0 w-1.5 ${tone.bar}`} />
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${tone.badge}`}
                    >
                      {tone.label}
                    </span>
                    <span className="mt-1.5 block text-sm font-bold text-[#0f172a]">{t.name}</span>
                    <span className="mt-0.5 line-clamp-2 block text-xs text-[#64748b]">
                      {t.content}
                    </span>
                    <span className="mt-2 block text-xs font-semibold text-[#00a896] opacity-0 transition group-hover:opacity-100">
                      Use this template
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1. Write */}
          <Section
            step={1}
            title="Write your message"
            note="Put the most important detail first."
            done={title.trim().length > 0 && content.trim().length > 0}
          >
            <div className="space-y-5">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="ann-title" className="text-sm font-semibold text-[#242629]">
                    Title
                  </label>
                  <span
                    className={`text-xs ${
                      title.length > SOFT_TITLE ? 'font-semibold text-amber-600' : 'text-gray-400'
                    }`}
                  >
                    {title.length}/{SOFT_TITLE}
                  </span>
                </div>
                <input
                  id="ann-title"
                  type="text"
                  value={title}
                  maxLength={MAX_TITLE}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Annual Sports Day 2026 schedule"
                  className="w-full rounded-lg border border-[#cfd4dd] bg-[#f7f9fa] px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-[#073b78] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#073b78]/15"
                />
                {title.length > SOFT_TITLE && (
                  <p className="mt-1 text-xs text-amber-600">
                    Long titles may be cut off on mobile.
                  </p>
                )}
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="ann-content" className="text-sm font-semibold text-[#242629]">
                    Message
                  </label>
                  <span
                    className={`text-xs ${
                      content.length > MAX_CONTENT * 0.9 ? 'font-semibold text-red-500' : 'text-gray-400'
                    }`}
                  >
                    {content.length}/{MAX_CONTENT}
                  </span>
                </div>
                <textarea
                  id="ann-content"
                  value={content}
                  maxLength={MAX_CONTENT}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      e.currentTarget.form?.requestSubmit();
                    }
                  }}
                  placeholder="Write the details here."
                  rows={7}
                  className="w-full resize-y rounded-lg border border-[#cfd4dd] bg-[#f7f9fa] px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-[#073b78] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#073b78]/15"
                />
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full transition-all ${
                      content.length > MAX_CONTENT * 0.9 ? 'bg-red-500' : 'bg-[#00a896]'
                    }`}
                    style={{ width: `${Math.min((content.length / MAX_CONTENT) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* 2. Urgency */}
          <Section step={2} title="How urgent is it?" done>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {PRIORITIES.map((p) => {
                const on = priority === p.value;
                return (
                  <button
                    type="button"
                    key={p.value}
                    aria-pressed={on}
                    onClick={() => setPriority(p.value)}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition sm:flex-col sm:items-start ${
                      on ? p.selected : 'border-[#cfd4dd] bg-white hover:border-gray-400'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        on ? 'bg-white/20 text-white' : p.iconWrap
                      }`}
                    >
                      {PRIORITY_ICONS[p.value] ?? <InfoIcon />}
                    </span>
                    <span>
                      <span className={`block text-sm font-bold ${on ? 'text-white' : 'text-[#242629]'}`}>
                        {p.label}
                      </span>
                      <span className={`block text-xs ${on ? 'text-white/85' : 'text-[#64748b]'}`}>
                        {p.hint}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {priority === 'emergency' && (
              <div className="mt-4 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertIcon />
                <p>
                  Emergency announcements stand out for everyone. You will be asked to confirm
                  before it is sent.
                </p>
              </div>
            )}
          </Section>

          {/* 3. Audience */}
          <Section step={3} title="Who should see it?" done>
            <div
              className={`grid grid-cols-1 gap-3 ${
                audiences.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'
              }`}
            >
              {audiences.map((a) => {
                const on = targetAudience === a.value;
                return (
                  <button
                    type="button"
                    key={a.value}
                    aria-pressed={on}
                    onClick={() => setTargetAudience(a.value)}
                    className={`relative rounded-xl border p-3 text-left transition ${
                      on
                        ? 'border-[#00a896] bg-[#e6f6f4] ring-1 ring-[#00a896]'
                        : 'border-[#cfd4dd] bg-white hover:border-gray-400'
                    }`}
                  >
                    <span
                      className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${
                        on ? 'bg-[#00a896] text-white' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <UsersIcon />
                    </span>
                    <span className="block text-sm font-bold text-[#242629]">{a.label}</span>
                    <span className="mt-0.5 block text-xs text-[#64748b]">{a.hint}</span>
                    {on && (
                      <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#00a896] text-white">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section step={4} title="Attach a file" done={Boolean(attachment)}>
            <FileField
              purpose="announcement-attachment"
              scope={role === 'admin' ? 'system' : undefined}
              accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
              maxFileSizeBytes={25 * 1024 * 1024}
              label="Choose an announcement attachment"
              fileId={attachment?.id}
              fileName={attachment?.name}
              onChange={(file) => setAttachment(file ? { id: file.fileId, name: file.fileName } : null)}
            />
          </Section>

          {/* 4. Options */}
          <Section step={5} title="Options" done>
            <button
              type="button"
              role="switch"
              aria-checked={requireReadConfirmation}
              onClick={() => setRequireReadConfirmation((v) => !v)}
              className={`flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3.5 text-left transition ${
                requireReadConfirmation
                  ? 'border-[#00a896] bg-[#e6f6f4]'
                  : 'border-[#cfd4dd] bg-[#f7f9fa] hover:bg-gray-50'
              }`}
            >
              <span>
                <span className="block text-sm font-semibold text-[#242629]">
                  Track who has read it
                </span>
                <span className="mt-0.5 block text-xs text-[#64748b]">
                  See which parents and teachers have opened this announcement.
                </span>
              </span>
              <span
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  requireReadConfirmation ? 'bg-[#00a896]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    requireReadConfirmation ? 'left-[22px]' : 'left-0.5'
                  }`}
                />
              </span>
            </button>
          </Section>

          {/* Mobile preview toggle */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="w-full rounded-lg border border-[#cfd4dd] bg-white px-4 py-2.5 text-sm font-semibold text-[#073b78]"
            >
              {showPreview ? 'Hide preview' : 'Show preview'}
            </button>
            {showPreview && <div className="mt-3">{preview}</div>}
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertIcon />
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Sticky action bar */}
          <div className="sticky bottom-0 z-10 -mx-1 flex items-center justify-between gap-3 rounded-2xl border border-[#e2e6ee] bg-white/95 p-3 shadow-lg backdrop-blur">
            <p className="hidden text-xs text-[#64748b] sm:block">
              Sending to <strong className="text-[#073b78]">{activeAudience.label}</strong> as{' '}
              <strong>{activePriority.label}</strong>. Press Ctrl + Enter in the message to publish.
            </p>
            <div className="ml-auto flex items-center gap-2">
              <Link
                href={config.listHref}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#555962] transition hover:bg-gray-100"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={!canSubmit}
                className={`inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
                  priority === 'emergency'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-[#00a896] hover:bg-[#008f80]'
                }`}
              >
                {isSubmitting && (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {isSubmitting ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </form>

        {/* Desktop preview + tips */}
        <div className="hidden space-y-4 lg:sticky lg:top-6 lg:col-span-2 lg:block">
          {preview}
          <div className="overflow-hidden rounded-2xl border border-[#e2e6ee] bg-white shadow-sm">
            <div className="flex items-center gap-3 bg-gradient-to-r from-[#073b78] to-[#0a56a8] px-5 py-4 text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                <BulbIcon />
              </span>
              <div>
                <p className="text-sm font-bold">Writing tips</p>
                <p className="text-xs text-white/75">Clear messages get read faster</p>
              </div>
            </div>
            <ul className="divide-y divide-gray-100">
              {[
                {
                  text: 'Keep titles under 60 characters.',
                  chip: 'bg-blue-100 text-[#073b78]',
                  icon: <InfoIcon />,
                },
                {
                  text: 'Use Urgent and Emergency sparingly so they keep their impact.',
                  chip: 'bg-amber-100 text-amber-600',
                  icon: <BellIcon />,
                },
                {
                  text: 'Put the most important detail in the first sentence.',
                  chip: 'bg-[#e6f6f4] text-[#00a896]',
                  icon: <CheckIcon className="h-5 w-5" />,
                },
              ].map((tip) => (
                <li key={tip.text} className="flex items-center gap-3 px-5 py-3.5">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tip.chip}`}
                  >
                    {tip.icon}
                  </span>
                  <span className="text-sm text-[#334155]">{tip.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* SUCCESS POPUP */}
      {published && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pub-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/50 p-4 backdrop-blur-sm"
        >
          <style>{`
            @keyframes pub-overlay { from { opacity: 0; } to { opacity: 1; } }
            @keyframes pub-card { from { opacity: 0; transform: translateY(16px) scale(.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
            @keyframes pub-pop { 0% { transform: scale(.6); opacity: 0; } 60% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
            @keyframes pub-ring { 0% { transform: scale(1); opacity: .5; } 100% { transform: scale(1.9); opacity: 0; } }
            .pub-overlay { animation: pub-overlay .2s ease both; }
            .pub-card { animation: pub-card .3s ease both; }
            .pub-pop { animation: pub-pop .45s ease .15s both; }
            .pub-ring { animation: pub-ring 1.4s ease-out .3s 1 both; }
            @media (prefers-reduced-motion: reduce) { .pub-overlay, .pub-card, .pub-pop, .pub-ring { animation: none; } }
          `}</style>

          <div className="pub-card relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            <button
              type="button"
              onClick={resetForm}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#64748b] transition hover:bg-gray-100"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" {...ip}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="relative mx-auto h-16 w-16">
              <span className="pub-ring absolute inset-0 rounded-full bg-[#00a896]/30" />
              <div className="pub-pop relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#00a896] to-[#00c2ad] text-white shadow-lg shadow-[#00a896]/30">
                <SendIcon className="h-7 w-7" />
              </div>
            </div>

            <h2 id="pub-title" className="mt-5 text-xl font-bold text-[#0f172a]">
              Announcement sent
            </h2>
            <p className="mt-1 text-sm text-[#64748b]">
              It is now live for {activeAudience.label.toLowerCase()}.
            </p>

            <div className="relative mt-6 overflow-hidden rounded-xl border border-[#e2e6ee] bg-[#f7f9fa] p-4 pl-5 text-left">
              <span className={`absolute inset-y-0 left-0 w-1.5 ${activePriority.bar}`} />
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${activePriority.badge}`}
                >
                  {activePriority.label}
                </span>
                <span className="text-xs text-[#94a3b8]">Just now</span>
              </div>
              <p className="mt-2 break-words text-sm font-bold text-[#0f172a]">{title.trim()}</p>
              <p className="mt-1 line-clamp-2 break-words text-xs text-[#64748b]">
                {content.trim()}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-[#e6f6f4] px-2.5 py-1 font-semibold text-[#007a6c]">
                  To: {activeAudience.label}
                </span>
                {requireReadConfirmation && (
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-[#073b78]">
                    Read tracking on
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-[#cfd4dd] bg-white px-5 py-2.5 text-sm font-semibold text-[#073b78] transition hover:bg-gray-50"
              >
                Create another
              </button>
              <Link
                href={config.listHref}
                className="rounded-lg bg-[#073b78] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#062f60]"
              >
                View announcements
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* EMERGENCY CONFIRM DIALOG */}
      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center gap-3 bg-red-600 px-6 py-4 text-white">
              <AlertIcon />
              <h3 className="text-lg font-bold">Publish emergency announcement?</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-[#555962]">
                This will be sent to <strong>{activeAudience.label}</strong> as an emergency.
                Check the message before continuing.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#555962] hover:bg-gray-100"
                >
                  Go back
                </button>
                <button
                  type="button"
                  onClick={publish}
                  className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Yes, publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
