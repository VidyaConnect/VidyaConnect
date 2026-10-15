import SuperAdminAnnouncementForm from '@/features/announcements/components/SuperAdminAnnouncementForm';
import RolePortalChrome from '@/features/announcements/components/RolePortalChrome';

export default function SuperAdminComposePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RolePortalChrome userRole="super-admin" />
      <main className="ml-56 p-6">
        <SuperAdminAnnouncementForm />
      </main>
    </div>
  );
}
