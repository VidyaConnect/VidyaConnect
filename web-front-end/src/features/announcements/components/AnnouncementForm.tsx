'use client';

import { useState } from 'react';
import { AnnouncementPriority, TargetAudience, CreateAnnouncementInput } from '../types/announcement';
import { createAnnouncement } from '../services/announcementService';

const PRIORITY_OPTIONS: { value: AnnouncementPriority; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'emergency', label: 'Emergency' },
];

const AUDIENCE_OPTIONS: { value: TargetAudience; label: string }[] = [
  { value: 'school-wide', label: 'School-Wide' },
  { value: 'class-level', label: 'Class-Level' },
  { value: 'specific-entities', label: 'Specific Entities' },
];

export default function AnnouncementForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<AnnouncementPriority>('normal');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('school-wide');
  const [requireReadConfirmation, setRequireReadConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    const input: CreateAnnouncementInput = {
      title,
      content,
      priority,
      targetAudience,
      requireReadConfirmation,
    };

    await createAnnouncement(input);

    setIsSubmitting(false);
    setSuccessMessage('Announcement published successfully!');
    setTitle('');
    setContent('');
    setPriority('normal');
    setTargetAudience('school-wide');
    setRequireReadConfirmation(false);
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200 p-6">
      <h1 className="text-2xl font-bold text-gray-900">Create New Announcement</h1>
      <p className="text-gray-500 text-sm mt-1">
        Draft and broadcast notifications to your school community.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Title */}
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

        {/* Urgency + Audience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level
            </label>
            <div className="flex gap-2">
              {PRIORITY_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setPriority(opt.value)}
                  className={`flex-1 border rounded-md py-2 text-sm font-medium ${
                    priority === opt.value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
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
        </div>

        {/* Content */}
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

        {/* Read confirmation toggle */}
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

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {successMessage && (
            <span className="text-green-600 text-sm">{successMessage}</span>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-auto bg-blue-900 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-800 disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Now'}
          </button>
        </div>
      </form>
    </div>
  );
}