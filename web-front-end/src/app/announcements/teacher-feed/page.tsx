import TeacherAnnouncementFeed from '@/features/announcements/components/TeacherAnnouncementFeed';
import RolePortalChrome from '@/features/announcements/components/RolePortalChrome';

export default function TeacherFeedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RolePortalChrome userRole="teacher" />
      <main className="ml-56 p-6">
        <TeacherAnnouncementFeed />
      </main>
    </div>
  );
}
