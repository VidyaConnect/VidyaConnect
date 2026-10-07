import SuperAdminAnnouncementForm from '@/features/announcements/components/SuperAdminAnnouncementForm';
import RolePortalChrome from '@/features/announcements/components/RolePortalChrome';

export default function AdminComposePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RolePortalChrome userRole="admin" />
      <main className="ml-56 p-6">
        <SuperAdminAnnouncementForm />
      </main>
    </div>
  );
}