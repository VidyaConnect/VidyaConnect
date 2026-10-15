import AnnouncementList from '@/features/announcements/components/AnnouncementList';
import RolePortalChrome from '@/features/announcements/components/RolePortalChrome';

export default function SuperAdminAnnouncementViewPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RolePortalChrome userRole="super-admin" />
      <main className="ml-56 p-6">
        <AnnouncementList
          scope="platform"
          createHref="/announcements/super-admin-compose"
          title="Platform Announcements"
          description="Manage important platform announcements and communications shared across VidyaConnect schools."
        />
      </main>
    </div>
  );
}