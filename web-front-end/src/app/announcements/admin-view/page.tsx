'use client';

import RolePortalChrome from '@/components/RolePortalChrome';
import AnnouncementList from '@/features/announcements/components/AnnouncementList';

export default function AdminAnnouncementsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RolePortalChrome userRole="admin" />
      <main className="mx-auto w-full max-w-[1500px] p-6">
        <AnnouncementList role="admin" />
      </main>
    </div>
  );
}