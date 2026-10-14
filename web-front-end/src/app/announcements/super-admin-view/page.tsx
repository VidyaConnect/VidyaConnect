import SuperAdminAnnouncementView from '@/features/announcements/components/SuperAdminAnnouncementView';
import RolePortalChrome from '@/components/RolePortalChrome';
export default function SuperAdminAnnouncementViewPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RolePortalChrome userRole="admin" />
      <main className="ml-56 p-6">
        <SuperAdminAnnouncementView />
      </main>
    </div>
  );
}
