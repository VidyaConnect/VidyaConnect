import AnnouncementList from '@/features/announcements/components/AnnouncementList';
import RolePortalChrome from '@/features/announcements/components/RolePortalChrome';

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RolePortalChrome userRole="admin" />
      <main className="ml-56 p-6">
        <AnnouncementList />
      </main>
    </div>
  );
}
