'use client';

import { useState } from 'react';
import { AnnouncementPriority, TargetAudience, CreateAnnouncementInput } from '../types/announcement';
import { createAnnouncement } from '../services/announcementService';

const PRIORITY_OPTIONS: {
  value: AnnouncementPriority;
  label: string;
  dot: string;
  activeClasses: string;
  badgeClasses: string;
}[] = [
  {
    value: 'normal',
    label: 'Normal',
    dot: 'bg-blue-500',
    activeClasses: 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600',
    badgeClasses: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20'
  },
  {
    value: 'urgent',
    label: 'Urgent',
    dot: 'bg-amber-500',
    activeClasses: 'border-amber-500 bg-amber-50 text-amber-700 ring-1 ring-amber-500',
    badgeClasses: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
  },
  {
    value: 'emergency',
    label: 'Emergency',
    dot: 'bg-red-500',
    activeClasses: 'border-red-600 bg-red-50 text-red-700 ring-1 ring-red-600',
    badgeClasses: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
  }
];

const AUDIENCE_OPTIONS: { value: TargetAudience; label: string }[] = [
  { value: 'school-wide', label: 'School-Wide' },
  { value: 'class-level', label: 'Class-Level' },
  { value: 'specific-entities', label: 'Specific Entities' }
];

const MAX_CONTENT_LENGTH = 2000;

const COMPOSE_TIPS = [
  'Keep titles under 60 characters so they don\u2019t truncate on mobile devices.',
  'Use "Urgent" or "Emergency" sparingly \u2014 overuse trains readers to ignore them.',
  'Front-load the most important detail in your first sentence.',
  'Enable read confirmation for time-sensitive or compliance-related notices.'
];

export default function AnnouncementForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<AnnouncementPriority>('normal');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('school-wide');
  const [requireReadConfirmation, setRequireReadConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Announcement title is required.');
      return;
    }

    if (!content.trim()) {
      setErrorMessage('Announcement content is required.');
      return;
    }

    const input: CreateAnnouncementInput = {
      title: title.trim(),
      content: content.trim(),
      priority,
      targetAudience,
      requireReadConfirmation
    };

    setIsSubmitting(true);
    try {
      await createAnnouncement(input);
      setSuccessMessage('Announcement published successfully!');
      setTitle('');
      setContent('');
      setPriority('normal');
      setTargetAudience('school-wide');
      setRequireReadConfirmation(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to publish announcement.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const activePriority = PRIORITY_OPTIONS.find((opt) => opt.value === priority) ?? PRIORITY_OPTIONS[0];
  const audienceLabel = AUDIENCE_OPTIONS.find((opt) => opt.value === targetAudience)?.label ?? 'School-Wide';

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        {/* ── Main form (2/3 width on large screens) ───────────────── */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
            <div className={`h-1.5 w-full ${activePriority.dot}`} />

            <div className="p-6 sm:p-8">
              <div className="mb-8 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a2.25 2.25 0 01-2.25-2.25v-9a2.25 2.25 0 012.25-2.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25c-.704 0-1.402.03-2.09.09m-4.5 0a48.474 48.474 0 007.5 0m-7.5 0v-.375c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v.375m-7.5 0v-.375c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v.375"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">Create New Announcement</h1>
                  <p className="mt-0.5 text-sm text-gray-500">Draft and broadcast notifications to your school community.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-7">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Announcement Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Annual Sports Day 2026 Schedule"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-150 focus:border-[#1B2559] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2559]/15"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Urgency Level</label>
                    <div className="flex gap-2">
                      {PRIORITY_OPTIONS.map((opt) => (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => setPriority(opt.value)}
                          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2.5 text-sm font-medium transition-all duration-150 ${
                            priority === opt.value
                              ? opt.activeClasses
                              : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${opt.dot}`} />
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Target Audience</label>
                    <div className="relative">
                      <select
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value as TargetAudience)}
                        className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50/50 px-3.5 py-2.5 pr-9 text-sm text-gray-900 transition-colors duration-150 focus:border-[#1B2559] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2559]/15"
                      >
                        {AUDIENCE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Announcement Content</label>
                    <span className={`text-xs ${content.length > MAX_CONTENT_LENGTH ? 'text-red-500' : 'text-gray-400'}`}>
                      {content.length}/{MAX_CONTENT_LENGTH}
                    </span>
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your detailed announcement here..."
                    rows={8}
                    className="w-full resize-none rounded-lg border border-gray-300 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-150 focus:border-[#1B2559] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2559]/15"
                    required
                  />
                </div>

                <label
                  htmlFor="readConfirm"
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-gray-50/60 px-4 py-3.5 transition-colors duration-150 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    id="readConfirm"
                    checked={requireReadConfirmation}
                    onChange={(e) => setRequireReadConfirmation(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">Require read confirmation</span>
                    <span className="mt-0.5 block text-gray-500">Track which parents/teachers have viewed this announcement.</span>
                  </span>
                </label>

                <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-h-5">
                    {successMessage && (
                      <div className="flex items-center gap-1.5 text-sm text-emerald-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {successMessage}
                      </div>
                    )}
                    {errorMessage && (
                      <div className="flex items-center gap-1.5 text-sm text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                          />
                        </svg>
                        {errorMessage}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B2559] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-[#141c45] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-sm"
                  >
                    {isSubmitting && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    )}
                    {isSubmitting ? 'Publishing...' : 'Publish Now'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ── Right rail: live preview + tips (1/3 width on large screens) ── */}
        <div className="space-y-6 lg:col-span-1">
          {/* Live preview */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/60 px-5 py-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Live Preview</span>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-2">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${activePriority.badgeClasses}`}>
                  {activePriority.label}
                </span>
                <span className="text-xs text-gray-400">Just now</span>
              </div>

              <h3 className="mt-3 text-base font-semibold text-gray-900">
                {title.trim() ? title : <span className="text-gray-300">Your announcement title</span>}
              </h3>

              <p className="mt-1.5 line-clamp-4 text-sm text-gray-600">
                {content.trim() ? content : <span className="text-gray-300">Your announcement content will appear here as you type...</span>}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  {audienceLabel}
                </span>
                {requireReadConfirmation && (
                  <span className="inline-flex items-center gap-1 text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Read confirmation on
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Compose tips */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Composing tips</span>
            </div>
            <ul className="mt-3 space-y-2.5">
              {COMPOSE_TIPS.map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-300" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}