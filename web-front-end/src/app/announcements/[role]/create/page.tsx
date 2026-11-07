'use client';

import { notFound, useParams } from 'next/navigation';
import RolePortalChrome from '@/components/RolePortalChrome';
import AnnouncementForm from '@/features/announcements/components/AnnouncementForm';
import { ROLE_CONFIG, type AnnouncementRole } from '@/features/announcements/components/roleConfig';

export default function RoleCreateAnnouncementPage() {
  const { role } = useParams<{ role: string }>();
  if (!Object.prototype.hasOwnProperty.call(ROLE_CONFIG, role)) notFound();
  const r = role as AnnouncementRole;

  return (
    <div className="min-h-screen bg-gray-50">
      <RolePortalChrome userRole={r} />
      <main className="mx-auto w-full max-w-[1500px] p-6">
        <nav className="mb-4 text-sm text-gray-500">
          <span>Announcements</span>
          <span className="mx-2">›</span>
          <span className="font-medium text-gray-900">Create New Announcement</span>
        </nav>
        <AnnouncementForm role={r} />
      </main>
    </div>
  );
}