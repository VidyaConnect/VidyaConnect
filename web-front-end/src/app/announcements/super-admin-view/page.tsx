import SuperAdminAnnouncementView from '@/features/announcements/components/SuperAdminAnnouncementView';
import RolePortalChrome from '@/features/announcements/components/RolePortalChrome';

export default function SuperAdminAnnouncementViewPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RolePortalChrome userRole="super-admin" />
      <main className="ml-56 p-6">
        <SuperAdminAnnouncementView />
      </main>
    </div>
  );
}
