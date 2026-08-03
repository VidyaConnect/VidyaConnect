'use client';

import { useState } from 'react';
import { CreateAnnouncementInput } from '../types/announcement';
import { createAnnouncement, saveDraftAnnouncement } from '../services/announcementService';

export default function SuperAdminAnnouncementForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState<'general' | 'important' | null>(null);
  const [distributeToAll, setDistributeToAll] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  function resetForm() {
    setTitle('');
    setContent('');
    setSelectedTag(null);
    setDistributeToAll(true);
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
      targetAudience: distributeToAll ? 'all-schools' : 'specific-entities',
      requireReadConfirmation: false,
      distributionTags: distributeToAll ? ['Global Network'] : [],
    };

    await createAnnouncement(input);

    setIsSubmitting(false);
    setMessage('Announcement broadcast successfully!');
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
      targetAudience: distributeToAll ? 'all-schools' : 'specific-entities',
      requireReadConfirmation: false,
    };

    await saveDraftAnnouncement(input);

    setIsSubmitting(false);
    setMessage('Draft saved successfully!');
    resetForm();
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200 p-6">
      <h1 className="text-lg font-bold text-gray-900">New System Announcement</h1>
      <p className="text-gray-500 text-sm mt-1">
        Draft a message to be broadcast across the school network.
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
            placeholder="e.g. Scheduled System Maintenance for Q3 Updates"
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

        <div className="border border-gray-200 rounded-md p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Distribution Network</span>
            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-1">
                <input type="radio" checked={distributeToAll} onChange={() => setDistributeToAll(true)} />
                All Schools
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" checked={!distributeToAll} onChange={() => setDistributeToAll(false)} />
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
              className="bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Review & Send'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
