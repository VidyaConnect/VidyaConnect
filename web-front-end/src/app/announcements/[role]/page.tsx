'use client';

import { notFound, useParams } from 'next/navigation';
import RolePortalChrome from '@/components/RolePortalChrome';
import AnnouncementList from '@/features/announcements/components/AnnouncementList';
import { ROLE_CONFIG, type AnnouncementRole } from '@/features/announcements/components/roleConfig';

export default function RoleAnnouncementsPage() {
  const { role } = useParams<{ role: string }>();
  if (!Object.prototype.hasOwnProperty.call(ROLE_CONFIG, role)) notFound();
  const r = role as AnnouncementRole;

  return (
    <div className="min-h-screen bg-gray-50">
      <RolePortalChrome userRole={r} />
      <main className="mx-auto w-full max-w-[1500px] p-6">
        <AnnouncementList role={r} />
      </main>
    </div>
  );
}