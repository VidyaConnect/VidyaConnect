import StudentAnnouncementFeed from '@/features/announcements/components/StudentAnnouncementFeed';
import RolePortalChrome from '@/features/announcements/components/RolePortalChrome';

export default function StudentFeedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RolePortalChrome userRole="student" />
      <main className="ml-56 p-6">
        <StudentAnnouncementFeed />
      </main>
    </div>
  );
}
