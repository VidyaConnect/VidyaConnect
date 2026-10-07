'use client';

import { useEffect, useState } from 'react';
import RolePortalChrome from '@/features/announcements/components/RolePortalChrome';
import SuperAdminAnnouncementView from '@/features/announcements/components/SuperAdminAnnouncementView';
import AnnouncementList from '@/features/announcements/components/AnnouncementList';
import TeacherAnnouncementFeed from '@/features/announcements/components/TeacherAnnouncementFeed';

type Role = 'admin' | 'school-admin' | 'teacher';

// The only place that knows where the role comes from.
// Replace this with the real logged-in user's role from useAuth() later.
function getCurrentRole(): Role | null {
  const role = localStorage.getItem('role');
  if (role === 'admin' || role === 'school-admin' || role === 'teacher') {
    return role;
  }
  return null;
}

export default function AnnouncementsPage() {
  const [role, setRole] = useState<Role | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRole(getCurrentRole());
    setReady(true);
  }, []);

  if (!ready) return <div className="min-h-screen bg-gray-50" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <RolePortalChrome userRole={role ?? 'school-admin'} />
      <main className="mx-auto w-full max-w-6xl p-6">
        {role === 'admin' && <SuperAdminAnnouncementView />}
        {role === 'school-admin' && <AnnouncementList />}
        {role === 'teacher' && <TeacherAnnouncementFeed />}
        {role === null && (
          <p className="text-sm text-red-600">
            Please sign in to view announcements.
          </p>
        )}
      </main>
    </div>
  );
}