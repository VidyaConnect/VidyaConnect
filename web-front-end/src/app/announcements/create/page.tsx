import AnnouncementForm from '@/features/announcements/components/AnnouncementForm';
import RolePortalChrome from '@/features/announcements/components/RolePortalChrome';

export default function CreateAnnouncementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RolePortalChrome userRole="admin" />
      <main className="ml-56 p-6">
        <nav className="text-sm text-gray-500 mb-4">
          <span>Announcements</span>
          <span className="mx-2">›</span>
          <span className="text-gray-900 font-medium">Create New Announcement</span>
        </nav>
        <AnnouncementForm />
      </main>
    </div>
  );
}
