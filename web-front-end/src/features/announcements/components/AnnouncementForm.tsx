'use client';

import { useState } from 'react';
import { TargetAudience, CreateAnnouncementInput } from '../types/announcement';
import { createAnnouncement, saveDraftAnnouncement } from '../services/announcementService';

const AUDIENCE_OPTIONS: { value: TargetAudience; label: string }[] = [
  { value: 'school-wide', label: 'School-Wide' },
  { value: 'class-level', label: 'Class-Level' },
  { value: 'specific-entities', label: 'Specific Entities' },
];

export default function AnnouncementForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState<'general' | 'important' | null>(null);
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('school-wide');
  const [requireReadConfirmation, setRequireReadConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  function resetForm() {
    setTitle('');
    setContent('');
    setSelectedTag(null);
    setTargetAudience('school-wide');
    setRequireReadConfirmation(false);
  }

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    if (!selectedTag) {
      setMessage('Please choose General or Important before publishing.');
      return;
    }

    setIsSubmitting(true);
    const input: CreateAnnouncementInput = {
      title,
      content,
      tag: selectedTag,
      targetAudience,
      requireReadConfirmation,
    };

    await createAnnouncement(input);

    setIsSubmitting(false);
    setMessage('Announcement published successfully!');
    resetForm();
  }

  async function handleSaveDraft() {
    if (!title.trim() && !content.trim()) {
      setMessage('Add a title or message before saving a draft.');
      return;
    }

    setIsSubmitting(true);
    const input: CreateAnnouncementInput = {
      title,
      content,
      targetAudience,
      requireReadConfirmation,
    };

    await saveDraftAnnouncement(input);

    setIsSubmitting(false);
    setMessage('Draft saved successfully!');
    resetForm();
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200 p-6">
      <h1 className="text-2xl font-bold text-gray-900">Create New Announcement</h1>
      <p className="text-gray-500 text-sm mt-1">
        Draft and broadcast notifications to your school community.
      </p>

      <form onSubmit={handlePublish} className="mt-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Announcement Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Annual Sports Day 2026 Schedule"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Announcement Type
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSelectedTag('general')}
              className={`flex-1 border rounded-md py-2 text-sm font-semibold ${
                selectedTag === 'general'
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'border-green-300 bg-green-50 text-green-700'
              }`}
            >
              General
            </button>
            <button
              type="button"
              onClick={() => setSelectedTag('important')}
              className={`flex-1 border rounded-md py-2 text-sm font-semibold ${
                selectedTag === 'important'
                  ? 'bg-red-600 border-red-600 text-white'
                  : 'border-red-300 bg-red-50 text-red-700'
              }`}
            >
              Important
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Required to publish. Not required to save as draft.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Audience
          </label>
          <select
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value as TargetAudience)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {AUDIENCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Announcement Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your detailed announcement here..."
            rows={8}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="readConfirm"
            checked={requireReadConfirmation}
            onChange={(e) => setRequireReadConfirmation(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="readConfirm" className="text-sm text-gray-700">
            Require read confirmation — track which parents/teachers have viewed this.
          </label>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {message && <span className="text-sm text-gray-600">{message}</span>}
          <div className="ml-auto flex gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="border border-blue-900 text-blue-900 px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-50 disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-900 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Now'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}