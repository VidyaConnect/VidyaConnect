'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AnnouncementPriority,
  TargetAudience,
  CreateAnnouncementInput,
} from '../types/announcement';
import { createAnnouncement } from '../services/announcementService';

const MAX_TITLE = 100;
const SOFT_TITLE = 60;
const MAX_CONTENT = 2000;

const PRIORITIES: {
  value: AnnouncementPriority;
  label: string;
  hint: string;
  bar: string;
  selected: string;
  badge: string;
}[] = [
  {
    value: 'normal',
    label: 'Normal',
    hint: 'General news and updates',
    bar: 'bg-[#073b78]',
    selected: 'border-[#073b78] bg-[#073b78]/5 ring-1 ring-[#073b78]',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    value: 'urgent',
    label: 'Urgent',
    hint: 'Needs attention soon',
    bar: 'bg-amber-500',
    selected: 'border-amber-500 bg-amber-50 ring-1 ring-amber-500',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    value: 'emergency',
    label: 'Emergency',
    hint: 'Immediate action required',
    bar: 'bg-red-600',
    selected: 'border-red-600 bg-red-50 ring-1 ring-red-600',
    badge: 'bg-red-100 text-red-700',
  },
];

const AUDIENCES: { value: TargetAudience; label: string; hint: string }[] = [
  { value: 'school-wide', label: 'School-Wide', hint: 'Everyone in your school' },
  { value: 'class-level', label: 'Class-Level', hint: 'Selected classes only' },
  { value: 'specific-entities', label: 'Specific Entities', hint: 'Chosen people or groups' },
];

const TEMPLATES: {
  name: string;
  title: string;
  content: string;
  priority: AnnouncementPriority;
}[] = [
  {
    name: 'Holiday notice',
    title: 'School closed for the holiday',
    content:
      'Please note that the school will remain closed on the date mentioned. Classes will resume on the next working day.',
    priority: 'normal',
  },
  {
    name: 'Event reminder',
    title: 'Upcoming school event',
    content:
      'We are excited to invite everyone to our upcoming event. Please check the schedule and be on time.',
    priority: 'normal',
  },
  {
    name: 'Emergency closure',
    title: 'School closed tomorrow',
    content:
      'Due to unforeseen circumstances the school will be closed tomorrow. Please keep your children at home and watch for further updates.',
    priority: 'emergency',
  },
];

export default function AnnouncementForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<AnnouncementPriority>('normal');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('school-wide');
  const [requireReadConfirmation, setRequireReadConfirmation] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [published, setPublished] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const activePriority = PRIORITIES.find((p) => p.value === priority) ?? PRIORITIES[0];
  const activeAudience = AUDIENCES.find((a) => a.value === targetAudience) ?? AUDIENCES[0];
  const canSubmit =
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    content.length <= MAX_CONTENT &&
    !isSubmitting;

  function resetForm() {
    setTitle('');
    setContent('');
    setPriority('normal');
    setTargetAudience('school-wide');
    setRequireReadConfirmation(false);
    setErrorMessage('');
    setPublished(false);
  }

  function applyTemplate(t: (typeof TEMPLATES)[number]) {
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
    if (!title.trim()) return setErrorMessage('Announcement title is required.');
    if (!content.trim()) return setErrorMessage('Announcement content is required.');

    // Extra safety step for emergencies
    if (priority === 'emergency') {
      setConfirmOpen(true);
      return;
    }
    publish();
  }

  /* ---------- Success screen ---------- */
  if (published) {
    return (
      <div className="mx-auto w-full max-w-xl">
        <div className="flex flex-col items-center rounded-2xl border border-[#cfd4dd] bg-white px-8 py-12 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e6f6f4]">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#00a896]" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-5 text-xl font-bold text-[#003b78]">Announcement published</h2>
          <p className="mt-1 text-sm text-[#555962]">
            “{title.trim()}” is now live for {activeAudience.label.toLowerCase()}.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/announcements"
              className="rounded-lg bg-[#073b78] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#062f60]"
            >
              View announcements
            </Link>
            <button
              onClick={resetForm}
              className="rounded-lg border border-[#cfd4dd] bg-white px-5 py-2.5 text-sm font-semibold text-[#073b78] transition hover:bg-gray-50"
            >
              Create another
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Form ---------- */
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:items-start">
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-[#cfd4dd] bg-white p-6 shadow-sm sm:p-8 lg:col-span-3"
        >
          <div>
            <h1 className="text-2xl font-bold text-[#003b78]">Create Announcement</h1>
            <p className="mt-1 text-sm text-[#555962]">
              Draft and broadcast a message to your school community.
            </p>
          </div>

          {/* Quick templates */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#64748b]">
              Quick start
            </p>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((t) => (
                <button
                  type="button"
                  key={t.name}
                  onClick={() => applyTemplate(t)}
                  className="rounded-full border border-[#cfd4dd] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#073b78] transition hover:border-[#00a896] hover:bg-[#e6f6f4]"
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-semibold text-[#242629]">Title</label>
              <span
                className={`text-xs ${
                  title.length > SOFT_TITLE ? 'text-amber-600' : 'text-gray-400'
                }`}
              >
                {title.length}/{SOFT_TITLE}
              </span>
            </div>
            <input
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

          {/* Priority */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#242629]">
              Urgency level
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {PRIORITIES.map((p) => (
                <button
                  type="button"
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className={`rounded-xl border p-3 text-left transition ${
                    priority === p.value
                      ? p.selected
                      : 'border-[#cfd4dd] bg-white hover:border-gray-400'
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-bold text-[#242629]">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${p.bar} ${
                        p.value === 'emergency' ? 'animate-pulse' : ''
                      }`}
                    />
                    {p.label}
                  </span>
                  <span className="mt-1 block text-xs text-[#64748b]">{p.hint}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Audience */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#242629]">
              Target audience
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {AUDIENCES.map((a) => (
                <button
                  type="button"
                  key={a.value}
                  onClick={() => setTargetAudience(a.value)}
                  className={`rounded-xl border p-3 text-left transition ${
                    targetAudience === a.value
                      ? 'border-[#00a896] bg-[#e6f6f4] ring-1 ring-[#00a896]'
                      : 'border-[#cfd4dd] bg-white hover:border-gray-400'
                  }`}
                >
                  <span className="block text-sm font-bold text-[#242629]">{a.label}</span>
                  <span className="mt-1 block text-xs text-[#64748b]">{a.hint}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-semibold text-[#242629]">Message</label>
              <span
                className={`text-xs ${
                  content.length > MAX_CONTENT ? 'text-red-500' : 'text-gray-400'
                }`}
              >
                {content.length}/{MAX_CONTENT}
              </span>
            </div>
            <textarea
              value={content}
              maxLength={MAX_CONTENT}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  e.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="Write the details here. Put the most important point first."
              rows={7}
              className="w-full resize-none rounded-lg border border-[#cfd4dd] bg-[#f7f9fa] px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-[#073b78] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#073b78]/15"
            />
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#00a896] transition-all"
                style={{ width: `${Math.min((content.length / MAX_CONTENT) * 100, 100)}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-400">Tip: press Ctrl + Enter to publish.</p>
          </div>

          {/* Read confirmation toggle */}
          <button
            type="button"
            role="switch"
            aria-checked={requireReadConfirmation}
            onClick={() => setRequireReadConfirmation((v) => !v)}
            className="flex w-full items-center justify-between gap-4 rounded-xl border border-[#cfd4dd] bg-[#f7f9fa] px-4 py-3.5 text-left transition hover:bg-gray-50"
          >
            <span>
              <span className="block text-sm font-semibold text-[#242629]">
                Require read confirmation
              </span>
              <span className="mt-0.5 block text-xs text-[#64748b]">
                Track which parents and teachers have viewed this announcement.
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

          {/* Error + submit */}
          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
            <Link
              href="/announcements"
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#555962] transition hover:bg-gray-100"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-[#073b78] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#062f60] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {isSubmitting ? 'Publishing...' : 'Publish now'}
            </button>
          </div>
        </form>

        {/* LIVE PREVIEW */}
        <div className="space-y-4 lg:sticky lg:top-6 lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-[#cfd4dd] bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-5 py-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#00a896]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
                Live preview
              </span>
            </div>

            <div className="p-5">
              <div className={`overflow-hidden rounded-xl border border-[#cfd4dd]`}>
                <div className={`h-1.5 w-full ${activePriority.bar} transition-colors`} />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${activePriority.badge}`}
                    >
                      {activePriority.label}
                    </span>
                    <span className="text-xs text-gray-400">Just now</span>
                  </div>

                  <h3 className="mt-3 break-words text-base font-bold text-gray-900">
                    {title.trim() || (
                      <span className="text-gray-300">Your announcement title</span>
                    )}
                  </h3>
                  <p className="mt-1.5 line-clamp-5 whitespace-pre-line break-words text-sm text-gray-600">
                    {content.trim() || (
                      <span className="text-gray-300">
                        Your message will appear here as you type...
                      </span>
                    )}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-gray-100 pt-3 text-xs text-gray-500">
                    <span>To: {activeAudience.label}</span>
                    {requireReadConfirmation && (
                      <span className="font-semibold text-[#00a896]">Read confirmation on</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#cfd4dd] bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
              Writing tips
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[#555962]">
              <li>• Keep titles under 60 characters.</li>
              <li>• Use Urgent and Emergency sparingly so they keep their impact.</li>
              <li>• Put the most important detail in the first sentence.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* EMERGENCY CONFIRM DIALOG */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-red-700">Publish emergency announcement?</h3>
            <p className="mt-2 text-sm text-[#555962]">
              This will be sent to <strong>{activeAudience.label}</strong> as an emergency.
              Please check the message before continuing.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#555962] hover:bg-gray-100"
              >
                Go back
              </button>
              <button
                onClick={publish}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Yes, publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}