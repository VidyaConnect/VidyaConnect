'use client';

import { useState } from 'react';
import { AnnouncementPriority, CreateAnnouncementInput } from '../types/announcement';
import { createAnnouncement } from '../services/announcementService';

const TYPE_OPTIONS: { value: AnnouncementPriority; label: string }[] = [
  { value: 'info', label: 'Info' },
  { value: 'update', label: 'Update' },
  { value: 'critical', label: 'Critical' },
  { value: 'feature', label: 'Feature' },
];

export default function SuperAdminAnnouncementForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<AnnouncementPriority>('info');
  const [distributeToAll, setDistributeToAll] = useState(true);
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
      targetAudience: distributeToAll ? 'all-schools' : 'specific-entities',
      requireReadConfirmation: false,
      distributionTags: distributeToAll ? ['Global Network'] : [],
    };

    await createAnnouncement(input);

    setIsSubmitting(false);
    setSuccessMessage('Announcement broadcast successfully!');
    setTitle('');
    setContent('');
    setPriority('info');
    setDistributeToAll(true);
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200 p-6">
      <h1 className="text-lg font-bold text-gray-900">New System Announcement</h1>
      <p className="text-gray-500 text-sm mt-1">
        Draft a message to be broadcast across the school network.
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
            placeholder="e.g. Scheduled System Maintenance for Q3 Updates"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Announcement Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Announcement Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TYPE_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setPriority(opt.value)}
                className={`border rounded-md py-2 text-sm font-medium ${
                  priority === opt.value
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Distribution Network */}
        <div className="border border-gray-200 rounded-md p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Distribution Network</span>
            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  checked={distributeToAll}
                  onChange={() => setDistributeToAll(true)}
                />
                All Schools
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  checked={!distributeToAll}
                  onChange={() => setDistributeToAll(false)}
                />
                Specific Entities
              </label>
            </div>
          </div>
          {distributeToAll && (
            <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded">
              Global Network
            </span>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your announcement content here..."
            rows={8}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {successMessage && (
            <span className="text-green-600 text-sm">{successMessage}</span>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-auto bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Review & Send'}
          </button>
        </div>
      </form>
    </div>
  );
}