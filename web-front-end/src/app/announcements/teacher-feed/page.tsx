import TeacherAnnouncementFeed from '@/features/announcements/components/TeacherAnnouncementFeed';
import RolePortalChrome from '@/features/announcements/components/RolePortalChrome';

export default function TeacherFeedPage() {
  return (
    <div className="min-h-screen bg-[#eef3f8]">
      <RolePortalChrome userRole="teacher" />
      <main className="ml-56 min-h-[calc(100vh-4rem)] px-4 py-5 sm:px-7 sm:py-7 lg:px-10">
        <TeacherAnnouncementFeed />
      </main>
    </div>
  );
}
